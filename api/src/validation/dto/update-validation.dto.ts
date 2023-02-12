import { PartialType } from '@nestjs/swagger'

import { CreateValidationDto } from './create-validation.dto'

export class UpdateValidationDto extends PartialType(CreateValidationDto) {}
