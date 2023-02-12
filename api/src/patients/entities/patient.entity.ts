import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Personnel } from 'personnel/entities/personnel.entity'

export type PatientDocument = Patient & mongoose.Document

@Schema({
  toJSON: {
    getters: true
  },
  toObject: {
    getters: true
  }
})
export class Patient {
  @Prop()
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  phoneNo: string

  @Prop()
  email: string

  @Prop()
  dob: Date

  @Prop()
  dateOfMostRecentScreener: Date

  @Prop()
  highestSeverityOfMostRecentScreener: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' })
  providerId: Personnel
}

export const PatientSchema = SchemaFactory.createForClass(Patient)
