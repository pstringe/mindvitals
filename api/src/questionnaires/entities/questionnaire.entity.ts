import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'

export type QuestionnaireDocument = Questionnaire & Document

@Schema()
export class Questionnaire {
  @Prop()
  resultHeading: string

  @Prop()
  name: string

  @Prop()
  questions: {prompt: string, answerSetIndex: number}[]

  @Prop()
  answerSets: {choice: string, pointValue: number}[][]

  @Prop()
  length: number

  @Prop()
  scoringScale: string[]
}

export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire)
