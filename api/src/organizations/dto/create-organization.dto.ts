import { ApiProperty } from '@nestjs/swagger'
import { File } from '../../files/entities/file.entity'
export class CreateOrganizationDto {
  @ApiProperty()
  name?: string

  @ApiProperty()
  connection?: string

  @ApiProperty()
  logo?: string
}
