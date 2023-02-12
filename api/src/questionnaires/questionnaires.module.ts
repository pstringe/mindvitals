import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { QuestionnaireSchema } from './entities/questionnaire.entity'
import { QuestionnairesController } from './questionnaires.controller'
import { QuestionnairesService } from './questionnaires.service'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Questionnaire', schema: QuestionnaireSchema }],
      'global',
    ),
  ],
  controllers: [QuestionnairesController],
  providers: [QuestionnairesService],
  exports: [QuestionnairesService],
})
export class QuestionnairesModule {}
