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

import { BatchService } from './batch.service'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { PaginationParams } from '../utils/entities/paginationParams';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto)
  }

  @Get('/screener-options')
  getScreenerOptions() {
    return this.batchService.getScreenerOptions()
  }
  
  @Get()
  findAll() {
    return this.batchService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchService.findOne(id)
  }

  @Get('/patient/:patient_id')
  findByPatientId(@Param('patient_id') id: string) {
    return this.batchService.findByPatientId(id)
  }

  @Get('/provider/:provider_id')
  findByProviderId(@Param('provider_id') id: string, @Query() {skip, limit}: PaginationParams, @Query() filter?: any) {
    return this.batchService.findByProviderId(skip, limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchService.update(id, updateBatchDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchService.remove(+id)
  }
}
