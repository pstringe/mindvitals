import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { get } from 'http'
import { Model, ObjectId } from 'mongoose'

import { OrganizationsService } from 'organizations/organizations.service'
import { QuestionnairesService } from 'questionnaires/questionnaires.service'
import { UsersService } from 'users/users.service'

import { CreateAssessmentDto } from './dto/create-assessment.dto'
import { UpdateAssessmentDto } from './dto/update-assessment.dto'
import { Assessment } from './entities/assessment.entity'

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel('Assessment')
    private readonly assessmentModel: Model<Assessment>,
    private readonly questionnairesService: QuestionnairesService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  private async createTempUser(assessmentId: string) {
    const organization = this.organizationsService.getActiveOrganizationId()
    const anonymousUser = await this.usersService.addUser({
      firstName: 'Anonymous',
      lastName: 'User',
      organization,
      username: assessmentId,
      password: assessmentId,
    })
    return anonymousUser
  }

  /*
   ** Along with a new assesment document, create an anonymous user authorized
   ** to make calls to this service from the patient side
   */

  public async create(createAssessmentDto: CreateAssessmentDto) {
    const questionnaire = await this.questionnairesService.findByQuery({
      name: createAssessmentDto.type,
    })
    if (!questionnaire) {
      throw new NotFoundException('This assessment type could not be found')
    }
    createAssessmentDto.answers = new Array(questionnaire.length).fill(-1)
    const assessment = new this.assessmentModel({
      ...createAssessmentDto,
      questionnaire,
    })
    const anonymousUser = await this.createTempUser(assessment._id)
    assessment.anonymousUser = anonymousUser
    assessment.passingThreshold = createAssessmentDto.passingThreshold
    assessment.resultHeading = questionnaire.resultHeading
    assessment.score = 0;
    assessment.severity = await this.getSeverity(assessment);
    assessment.save()
    return assessment
  }

  findAll() {
    const assessments = this.assessmentModel.find().exec()
    return assessments
  }

  public async findOne(id: string) {
    const assessment = await this.assessmentModel.findById(id)
    if (!assessment) {
      throw new NotFoundException('Assessment not Found: findOne')
    }
    return assessment
  }

  public async getSeverity(assessment: Assessment) {
    let questionnaire = assessment.questionnaire;
    if (!questionnaire.scoringScale) {
      questionnaire = await this.questionnairesService.findOne(assessment.questionnaire as unknown as ObjectId);
    }
    const score = assessment.score
    const severity = questionnaire.scoringScale[Math.max(+score - 1, 0)]
    return severity
  }

  private calculateScore(answers) {
    return answers.reduce((score, points) => {
      return points != -1 ? score + points : score
    }, 0)
  }

  public async update(id: string, updateAssessmentDto: UpdateAssessmentDto) {
    const assessment: any = await this.findOne(id)
    if (updateAssessmentDto.answers) {
      assessment.answers = updateAssessmentDto.answers
      assessment.score = this.calculateScore(updateAssessmentDto.answers);
      assessment.severity = await this.getSeverity(assessment)
    }
    if (updateAssessmentDto.complete) {
      assessment.complete = updateAssessmentDto.complete
    }
    await this.assessmentModel.updateOne({ _id: id }, { $set: assessment })
    return assessment
  }

  remove(id: number) {
    return `This action removes a #${id} assessment`
  }
}
