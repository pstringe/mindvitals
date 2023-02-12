import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Patient } from 'patients/entities/patient.entity'
import { Personnel } from 'personnel/entities/personnel.entity'

export type ReferralDocument = Referral & mongoose.Document

@Schema()
export class Referral {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
    patientId: Patient

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' })
    providerId: Personnel

    @Prop()
    referralDate: Date

    @Prop()
    description?: string;

    @Prop()
    method?: 'sms' | 'email';

    @Prop()
    batchId?: string
}

export const ReferralSchema = SchemaFactory.createForClass(Referral)
