import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'

import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto'
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto'
import { QuestionnairesService } from './questionnaires.service'

@Controller('questionnaires')
export class QuestionnairesController {
  constructor(private readonly questionnairesService: QuestionnairesService) {}

  @Post()
  create(@Body() createQuestionnaireDto: CreateQuestionnaireDto) {
    return this.questionnairesService.create(createQuestionnaireDto)
  }

  @Get()
  findAll() {
    return this.questionnairesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionnairesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    return this.questionnairesService.update(id, updateQuestionnaireDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionnairesService.remove(+id)
  }
}
