import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { File } from '../../files/entities/file.entity';
import * as mongoose from 'mongoose'

export type OrganizationDocument = Organization & Document

@Schema()
export class Organization {
  @Prop()
  name: string

  @Prop()
  connection: string

  @Prop()
  logo: string
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization)
