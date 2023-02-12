import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { AssessmentsService } from 'assessments/assessments.service'
import { Assessment } from '../assessments/entities/assessment.entity'
import { OrganizationsService } from '../organizations/organizations.service'
import { PatientsService } from 'patients/patients.service'
import { PersonnelService } from '../personnel/personnel.service'
import { UsersService } from '../users/users.service'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { Batch } from './entities/batch.entity'
import { CreateAssessmentDto } from 'assessments/dto/create-assessment.dto'
import { QuestionnairesService } from 'questionnaires/questionnaires.service'
import { QuestionnaireDocument } from 'questionnaires/entities/questionnaire.entity'

@Injectable()
export class BatchService {
  constructor(
    @InjectModel('Batch')
    private readonly batchModel: Model<Batch>,
    private readonly assessmentsService: AssessmentsService,
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
    private readonly patientService: PatientsService,
    private readonly personnelService: PersonnelService,
    private readonly questionnairesService: QuestionnairesService,
  ) {}

  private async createTempUser(batchId: string) {
    const organization = this.organizationsService.getActiveOrganizationId()
    const anonymousUser = await this.usersService.addUser({
      firstName: 'Anonymous',
      lastName: 'User',
      organization,
      username: batchId,
      password: batchId,
    })
    return anonymousUser
  }

  private async getAssessments(assessmentData) {
    const assessments = Promise.all(
      assessmentData.assessments.map(async data => {
        const assessment = await this.assessmentsService.create({
          ...data, 
          patientId: assessmentData.patient})
        return assessment
      }),
    )
    return assessments
  }

  private async getAssessmentQuestions(assessment, batchIndex) {
    let questions = assessment?.questionnaire?.questions;
    if (!questions) {
      let questionnaire: QuestionnaireDocument = await this.questionnairesService.findOne(assessment.questionnaire._id);
      assessment.questionnaire = questionnaire;
      questions = questionnaire?.questions;
    }

    /*
    ** With most of the assessments, each question prompt maps to the same set of possible answers,
    ** which in turn have the same mapping of point values. In the case of epds, there are multiple
    ** sets of possible answers, and the mappings of point values change from question to question.
    ** To solve this, we specify all the possible answer sets in the create-questionnaire.dto with 
    ** correct point value mappings, and then we use the answerSetIndex to determine which set of
    ** answers corresponds to the current question. This should enable greater customization of
    ** quesitonnaires in the future as well.
    */

    const answerSets = assessment.questionnaire.answerSets;
    const answers = assessment.answers
    const questionList = questions.map((question: {prompt: string, answerSetIndex: number}, assessmentIndex) => ({
      assessmentTitle: assessment.type,
      assessmentId: assessment._id,
      assessmentIndex,
      prompt: question.prompt,
      choices: answerSets[question.answerSetIndex],
      batchIndex,
      terminating: assessmentIndex === questions.length - 1,
      answer: answers[assessmentIndex],
    }))
    return questionList;
  }

  private async getQuestions(assessments){
    const questionList = await assessments.reduce(
      async (questions: Array<any>, assessment, index) => {
        const assessmentQuestions = await this.getAssessmentQuestions(assessment, index);
        const resolvedQuestions = await questions;
        return [...resolvedQuestions, ...assessmentQuestions];
      },
      [],
    )
    return questionList;
  }

  public async create(createBatchDto: CreateBatchDto) {
    const assessments = await this.getAssessments(createBatchDto)
    const questions = await this.getQuestions(assessments);
    const batch = new this.batchModel({ assessments, questions })
    const anonymousUser = await this.createTempUser(batch._id)
    const patient = await this.patientService.findOne(createBatchDto.patient)
    if (!patient) {
      throw new NotFoundException('Patient not found while creating screener')
    }
    const personnel = await this.personnelService.findOne(
      createBatchDto.personnel,
    )
    if (!personnel) {
      throw new NotFoundException('Personnel not found while creating screener')
    }
    batch.createDate = new Date()
    batch.modifyDate = new Date()
    batch.anonymousUser = anonymousUser
    batch.patient = patient
    batch.personnel = personnel
    batch.completed = false
    batch.requestMethod = createBatchDto.requestMethod;
    batch.patientFirstName = patient?.firstName;
    batch.patientLastName = patient?.lastName;
    batch.save()
    return batch
  }

  public async findAll() {
    const batches = await this.batchModel.find().exec()
    return batches
  }

  public async findOne(id: string) {
    const batch = await this.batchModel.findById(id)
    if (!batch) {
      throw new NotFoundException('Batch not Found: findOne')
    }
    return batch
  }

  public async findByPatientId(patientId: string) {
    const batches = await this.batchModel.find({ patient: patientId })
    .sort({ createDate: -1 })
    .exec()
    return batches
  }

  public async findByProviderId(skip: number, limit: number) {
    const batches = await this.batchModel.find({ completed: true })
    .sort({ createDate: -1 })
    .skip(skip)
    .limit(limit)
    .exec()
    const count = await this.batchModel.countDocuments({ completed: true });
    return { screeners: batches, count}
  }

  private getAnswers(questions) {
    const answerMap = {}
    questions.forEach(question => {
      if (!answerMap[question.assessmentId]) {
        answerMap[question.assessmentId] = []
      }
      answerMap[question.assessmentId].push(question.answer)
    })
    return answerMap
  }

  private async consolidateNextAssessment(assessments: Assessment[], index: number) {
    const assessment = assessments[index];
    const prevAssessment = assessments[Math.max(0, index - 1)];

    if (assessment.score >= assessment.passingThreshold && assessment.type !== 'PHQ-7') {
      return;
    }

    if (assessment.type === 'PHQ-2' && assessment.score < assessment.passingThreshold) {
      this.removeAssessmentByIndex(assessments, index + 1);
    }

    else if (assessment.type === 'PHQ-7' && assessments[index]) {
      assessments = await this.replaceAdjacentAssessmentsByIndex(assessments, index - 1, index, {
        type: 'PHQ-9',
        patientId: assessment.patientId.toString(),
        score: assessment.score + prevAssessment.score,
      });
    }
    return assessments;
  }

  private removeAssessmentByIndex(assessments: Assessment[], index: number) {
    assessments.splice(index, 1);
    return assessments;
  }

  private async replaceAdjacentAssessmentsByIndex(
    assessments: Assessment[],
    index1: number,
    index2: number,
    newAssessmentDto: CreateAssessmentDto
    ) {
    const newAssessment = await this.assessmentsService.create(newAssessmentDto);
    const assessment1 = assessments[index1];
    const assessment2 = assessments[index2];
    const newAnswers = [...assessment1.answers];
    for (let i = 0; i < assessment2.answers.length; i++) {
      newAnswers.push(assessment2.answers[i]);
    }
    newAssessment.answers = newAnswers;
    assessments.splice(index1, 2, newAssessment); 
    return assessments;
  }

  private async updateAssessment(assessmentId, answers, batch) {
    const assessment = await this.assessmentsService.update(assessmentId, {
      answers,
    })
    return assessment;
  };

  private async updateAssessments(answers, batch) {
    const assessmentIds = Object.keys(answers)
    return Promise.all(
      assessmentIds.map(async id => {
        return await this.updateAssessment(id, answers[id], batch);
      }),
    )
  }

  private async consolidateAssessments(assessments) {
    await Promise.all(assessments.map(async (assessment, idx) => {
      return await this.consolidateNextAssessment(assessments, idx);
    }));
    return assessments;
  }

  private async updatePatient(batch: Batch) {
    const patientId = batch?.patient?.toString()
    const patient = await this.patientService.findOne(patientId)
    patient.highestSeverityOfMostRecentScreener = batch.highestSeverity
    patient.dateOfMostRecentScreener = batch.modifyDate
    patient.save()
    return patient
  }

  private getSeverity(assessments: Assessment[]) {
    const highestScoringAssessment = assessments.reduce(
      (highest, currentAssessment) => {
        const score = currentAssessment?.score
        return score > highest?.score ? currentAssessment : highest
      },
    )
    return highestScoringAssessment.severity;
  }

  public async update(id: string, updateBatchDto: UpdateBatchDto) {
    const batch = await this.findOne(id)
    const questions = updateBatchDto.questions
    const answers = this.getAnswers(questions)
    const updatedAssessments = await this.updateAssessments(answers, batch)
    const consolidatedAssessments = await this.consolidateAssessments(updatedAssessments);
    const severity = await this.getSeverity(consolidatedAssessments)
    batch.highestSeverity = severity
    batch.modifyDate = new Date()
    batch.questions = await this.getQuestions(consolidatedAssessments);
    batch.assessments = consolidatedAssessments;
    if (updateBatchDto.completed) {
      batch.completed = true;
    }
    await this.batchModel.updateOne({ _id: batch._id }, { $set: batch })
    await this.updatePatient(batch)
    return batch
  }


  public async getScreenerOptions() {
    const screeners = [
      {
        value: 'gad7',
        label: 'GAD-7',
        payload: [{
          "type": "GAD-7",
        }]
      },
      {
        value: 'phq9',
        label: 'PHQ-9',
        payload: [{
          "type": "PHQ-9",
        }]
      },
      {
        value: 'cond-phq2-phq9',
        label: 'COND PHQ-2 to PHQ-9',
        payload: [{
            "type": "PHQ-2",
            "passingThreshold": 6
          },
          {
            "type": "PHQ-7",
          }
      ]
      },
      {
        value: 'epds',
        label: 'EPDS',
        payload: [{
          "type": "EPDS",
        }]
      }
    ]
    return screeners;
  }

  remove(id: number) {
    return `This action removes a #${id} batch`
  }
}