import { Injectable, NotFoundException } from '@nestjs/common'
import { compare } from 'bcrypt'
import { Console } from 'console'

import { PatientsService } from 'patients/patients.service'

import { ValidateDOBDto } from './dto/validate-dob.dto'

@Injectable()
export class ValidationService {
  constructor(private readonly patientsService: PatientsService) {}

  private compareDOB(date1: Date, date2: Date) {
    const day1 = date1.getDate()
    const day2 = date2.getUTCDate()
    const month1 = date1.getMonth()
    const month2 = date2.getUTCMonth()
    const year1 = date1.getFullYear()
    const year2 = date2.getUTCFullYear()

    return day1 == day2 && month1 == month2 && year1 == year2
  }

  public async validateDOB(validateDOBDto: ValidateDOBDto) {
    const patientId = validateDOBDto.patient
    const DOB = validateDOBDto.DOB

    const patient = await this.patientsService.findOne(patientId)
    if (!patient) {
      return new NotFoundException('patient not found: validateDOB')
    }
    if (!patient.dob) {
      return new NotFoundException('patient document does not contain a dob')
    }
    
    return { match: this.compareDOB(new Date(DOB), new Date(patient.dob)) }
  }
}
