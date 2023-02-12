import { ApiProperty } from '@nestjs/swagger'

export class CreatePatientDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  phoneNo: string

  @ApiProperty()
  email: string

  @ApiProperty()
  dob: Date

  @ApiProperty()
  dateOfMostRecentScreener: Date

  @ApiProperty()
  highestSeverityOfMostRecentScreener: string

  @ApiProperty()
  providerId: string
}
