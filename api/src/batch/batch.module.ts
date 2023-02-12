import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AssessmentsModule } from 'assessments/assessments.module'
import { OrganizationsModule } from 'organizations/organizations.module'
import { PatientsModule } from 'patients/patients.module'
import { PersonnelModule } from 'personnel/personnel.module'
import { UsersModule } from 'users/users.module'
import { QuestionnairesModule } from 'questionnaires/questionnaires.module'
import { BatchController } from './batch.controller'
import { BatchService } from './batch.service'
import { BatchSchema } from './entities/batch.entity'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Batch', schema: BatchSchema }],
      'clinic',
    ),
    AssessmentsModule,
    OrganizationsModule,
    UsersModule,
    PatientsModule,
    PersonnelModule,
    QuestionnairesModule,
  ],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
