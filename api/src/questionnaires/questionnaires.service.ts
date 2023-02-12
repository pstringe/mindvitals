import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'

import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto'
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto'
import { Questionnaire } from './entities/questionnaire.entity'

@Injectable()
export class QuestionnairesService {
  constructor(
    @InjectModel('Questionnaire')
    private readonly questionnaireModel: Model<Questionnaire>,
  ) {}

  public async create(createQuestionnaireDto: CreateQuestionnaireDto) {
    const questionnaire = await new this.questionnaireModel({
      ...createQuestionnaireDto,
      scoringScale: this.buildScoringScale(createQuestionnaireDto.scoringScale)
    })
    questionnaire.save()
    return questionnaire
  }

  findAll() {
    const questionnaires = this.questionnaireModel.find().exec()
    return questionnaires
  } 

  public async findOne(id: string | ObjectId) {
    const questionnaire = await this.questionnaireModel.findById(id)
    if (!questionnaire) {
      throw new NotFoundException('Quesionnaire not Found: findOne')
    }
    return questionnaire
  }

  public async findByQuery(query: object) {
    const questionnaire = await this.questionnaireModel.find(query)
    if (!questionnaire) {
      throw new NotFoundException('Quesionnaire not Found: findByQuery')
    }
    return questionnaire[0]
  }

  /*
   ** convert the scoring template into an array of strings so the severity can be
   ** updated in constant time when the score changes. This function only executes
   ** if the scoring scale changes.
   */

  public buildScoringScale(template: object) {
    const entries = Object.entries(template);
    const pairs = entries.sort(
      (a, b) => parseInt(a[0]) - parseInt(b[0]),
    )
    const thresholds = pairs.map(row => row[0])
    const scale = []

    for (let i = 0; i < thresholds.length; i++) {
      const currentThreshold = parseInt(thresholds[i])
      const start = i == 0 ? 0 : parseInt(thresholds[i - 1])
      for (let j = start; j < currentThreshold; j++) {
        scale.push(template[thresholds[i]])
      }
    }
    return scale
  }

  public async update(
    id: string,
    updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    const questionnaire = await this.findOne(id)
    if (updateQuestionnaireDto.name) {
      questionnaire.name = updateQuestionnaireDto.name
    }
    if (updateQuestionnaireDto.questions) {
      questionnaire.questions = updateQuestionnaireDto.questions
    }
    if (updateQuestionnaireDto.answerSets) {
      questionnaire.answerSets = updateQuestionnaireDto.answerSets
    }
    if (updateQuestionnaireDto.length) {
      questionnaire.length = updateQuestionnaireDto.length
    }
    if (updateQuestionnaireDto.resultHeading) {
      questionnaire.resultHeading = updateQuestionnaireDto.resultHeading
    }
    if (updateQuestionnaireDto.scoringScale) {
      const scale = this.buildScoringScale(updateQuestionnaireDto.scoringScale)
      questionnaire.scoringScale = scale
    }
    questionnaire.save()
    return questionnaire
  }

  remove(id: number) {
    return `This action removes a #${id} questionnaire`
  }
}
