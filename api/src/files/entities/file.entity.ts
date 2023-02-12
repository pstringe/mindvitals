import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type FileDocument = File & mongoose.Document

@Schema()
export class File {
  @Prop()
  name: string

  @Prop()
  type: string

  @Prop()
  data: Buffer

  @Prop()
  size: number
}

export const FileSchema = SchemaFactory.createForClass(File)