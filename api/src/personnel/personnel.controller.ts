import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'

import { CreatePersonnelDto } from './dto/create-personnel.dto'
import { UpdatePersonnelDto } from './dto/update-personnel.dto'
import { PersonnelService } from './personnel.service'

@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}

  @Post()
  create(@Body() createPersonnelDto: CreatePersonnelDto) {
    return this.personnelService.create(createPersonnelDto)
  }

  @Get()
  findAll() {
    return this.personnelService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personnelService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
  ) {
    return this.personnelService.updatePersonnel(id, updatePersonnelDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personnelService.remove(+id)
  }
}
