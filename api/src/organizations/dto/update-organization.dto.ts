import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'

import { CreateOrganizationDto } from './create-organization.dto'

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiProperty()
  name?: string

  @ApiProperty()
  connection?: string

  @ApiProperty()
  logo?: string
}
