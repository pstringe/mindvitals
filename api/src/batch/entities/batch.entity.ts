import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Assessment } from 'assessments/entities/assessment.entity'
import { Patient } from 'patients/entities/patient.entity'
import { Personnel } from 'personnel/entities/personnel.entity'
import { User } from 'users/user.model'

export type BatchDocument = Batch & mongoose.Document

export interface Question {
  assessmentId: string
  assessmentIndex: number
  assessmentTitle: string
  prompt: string
  choices: string[]
  answer: number
  batchIndex: number
  terminating: boolean
}

/*
 ** An array of batch assessments will be used to construct the
 */

export interface BatchAssessment {
  assessment: Assessment
  conditional: boolean //if true, the assessment must be passed to move on
}

@Schema({
  toJSON: {
    getters: true,
  },
})
export class Batch {
  @Prop()
  createDate: Date

  @Prop()
  modifyDate: Date

  @Prop()
  highestSeverity: string

  @Prop({ type: [Object] })
  assessments: BatchAssessment[]

  @Prop({ type: [Object] })
  questions: Question[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  anonymousUser: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patient: Patient

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' })
  personnel: Personnel

  @Prop()
  completed: boolean

  @Prop()
  requestMethod: 'sms' | 'email' | 'system' | 'qr'

  @Prop()
  patientFirstName: string

  @Prop()
  patientLastName: string
}

export const BatchSchema = SchemaFactory.createForClass(Batch)
