import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PersonnelModule } from 'personnel/personnel.module'

import { PatientSchema } from './entities/patient.entity'
import { PatientsController } from './patients.controller'
import { PatientsService } from './patients.service'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Patient', schema: PatientSchema }],
      'clinic',
    ),
    PersonnelModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
