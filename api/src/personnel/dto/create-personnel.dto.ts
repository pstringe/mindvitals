import { ApiProperty } from '@nestjs/swagger'

export class CreatePersonnelDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  organizationId: string
}
