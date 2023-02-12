import { ApiProperty } from '@nestjs/swagger'

export class CreateAssessmentDto {
  @ApiProperty()
  type?: string

  @ApiProperty()
  patientId?: string

  @ApiProperty()
  answers?: number[]

  @ApiProperty()
  complete?: boolean

  @ApiProperty()
  score?: number

  @ApiProperty()
  passingThreshold?: number
}
