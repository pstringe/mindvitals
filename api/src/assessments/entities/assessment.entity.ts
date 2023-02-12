import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Patient } from 'patients/entities/patient.entity'
import { Questionnaire, QuestionnaireDocument } from 'questionnaires/entities/questionnaire.entity'
import { User } from 'users/user.model'

export interface NextAssessment {
  assessment: AssessmentDocument
  key: 'score' | 'type'
  condition: 'GREATER_THAN' | 'LESS_THAN' | 'EQUAL_TO'
  value: number | string
}

export type AssessmentDocument = Assessment & mongoose.Document

@Schema()
export class Assessment {
  @Prop()
  type: string

  @Prop()
  resultHeading: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire' })
  questionnaire: QuestionnaireDocument

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patientId: Patient

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  anonymousUser: User

  @Prop()
  answers: number[]

  @Prop()
  score: number

  @Prop()
  severity: string

  @Prop()
  passingThreshold: number

  @Prop({ type: Object })
  next: NextAssessment

  @Prop()
  complete: boolean
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment)
