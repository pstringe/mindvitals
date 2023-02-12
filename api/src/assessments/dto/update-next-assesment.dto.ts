import { ApiProperty } from '@nestjs/swagger'

import { CreateAssessmentDto } from './create-assessment.dto'

export class UpdateNextAssessmentDto {
  @ApiProperty()
  assessment: CreateAssessmentDto

  @ApiProperty()
  next: {
    key: 'score' | 'type'
    condition: 'GREATER_THAN' | 'LESS_THAN' | 'EQUAL_TO'
    value: number | string
  }
}
