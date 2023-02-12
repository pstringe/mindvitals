import { Controller, Post, Body } from '@nestjs/common'

import { ValidateDOBDto } from './dto/validate-dob.dto'
import { ValidationService } from './validation.service'

@Controller('validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post('patient/dob')
  validateDOB(@Body() validateDOBDto: ValidateDOBDto) {
    return this.validationService.validateDOB(validateDOBDto)
  }
}
