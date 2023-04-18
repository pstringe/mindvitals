import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'

import { PaginationParams } from '../utils/entities/paginationParams'

import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { PatientsService } from './patients.service'

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto)
  }

  @Get()
  findAll(@Query() { skip, limit }: PaginationParams, @Query() params?: any) {
    return this.patientsService.findAll(skip, limit, params)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id)
  }

  @Get('/provider/:provider_id')
  findByProviderId(
    @Param('provider_id') id: string,
    @Query() { skip, limit }: PaginationParams,
    @Query() filters?: any,
    @Query() sorts?: any,
  ) {
    return this.patientsService.findByProviderId(id, skip, limit, filters)
  }

  // search for patients by name
  @Get('/search/:name')
  search(
    @Param('name') name,
    @Query() { skip, limit }: PaginationParams,
    @Query() filters?: any,
  ) {
    return this.patientsService.search(name, skip, limit, filters)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id)
  }
}
