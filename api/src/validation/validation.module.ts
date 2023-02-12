import { Module } from '@nestjs/common'

import { PatientsModule } from 'patients/patients.module'

import { ValidationController } from './validation.controller'
import { ValidationService } from './validation.service'

@Module({
  imports: [PatientsModule],
  controllers: [ValidationController],
  providers: [ValidationService],
})
export class ValidationModule {}
