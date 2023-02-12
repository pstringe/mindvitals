import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Organization } from 'organizations/entities/clinic.entity'
import { User } from 'users/user.model'

export type PersonnelDocument = Personnel & mongoose.Document

@Schema()
export class Personnel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User

  @Prop()
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  username: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization
}

export const PersonnelSchema = SchemaFactory.createForClass(Personnel)
