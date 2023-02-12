import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'

import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { OrganizationsService } from './organizations.service'

@Controller('clinics')
export class OrganizationsController {
  constructor(private readonly clinicsService: OrganizationsService) {}

  @Post()
  create(@Body() createClinicDto: CreateOrganizationDto) {
    return this.clinicsService.create(createClinicDto)
  }

  @Get()
  findAll() {
    return this.clinicsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateOrganizationDto,
  ) {
    console.log(id)
    return this.clinicsService.update(id, updateClinicDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(+id)
  }
}
