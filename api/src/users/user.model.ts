import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Organization } from 'organizations/entities/clinic.entity'
import { Personnel } from 'personnel/entities/personnel.entity'

export type UserDocument = User & mongoose.Document

@Schema()
export class User {
  @Prop()
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  username: string

  @Prop()
  password: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: Organization

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' })
  personnel: Personnel
}

export const UserSchema = SchemaFactory.createForClass(User)
