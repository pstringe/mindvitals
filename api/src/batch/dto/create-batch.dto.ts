import { ApiProperty } from '@nestjs/swagger'

import { CreateAssessmentDto } from 'assessments/dto/create-assessment.dto'

export class CreateBatchDto {
  @ApiProperty()
  assessments: CreateAssessmentDto[]

  @ApiProperty()
  patient: string

  @ApiProperty()
  personnel: string

  @ApiProperty()
  completed: boolean

  @ApiProperty()
  requestMethod: 'sms' | 'email' | 'system' | 'qr'
}
