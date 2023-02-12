import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrganizationsModule } from 'organizations/organizations.module'
import { QuestionnairesModule } from 'questionnaires/questionnaires.module'
import { UsersModule } from 'users/users.module'

import { AssessmentsController } from './assessments.controller'
import { AssessmentsService } from './assessments.service'
import { AssessmentSchema } from './entities/assessment.entity'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Assessment', schema: AssessmentSchema }],
      'clinic',
    ),
    QuestionnairesModule,
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
