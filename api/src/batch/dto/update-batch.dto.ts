import { PartialType, ApiProperty } from '@nestjs/swagger'

import { Question } from '../entities/batch.entity'

import { CreateBatchDto } from './create-batch.dto'

export class UpdateBatchDto extends PartialType(CreateBatchDto) {
  @ApiProperty()
  questions: Question[]
}
