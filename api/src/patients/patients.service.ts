import { Injectable, NotFoundException, Query } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { PersonnelService } from '../personnel/personnel.service'

import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { Patient } from './entities/patient.entity'

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel('Patient') private readonly patientModel: Model<Patient>,
    private readonly personnelService: PersonnelService,
  ) {}

  private sanitizePhoneNo(phoneNo: string) {
    if (!phoneNo || typeof phoneNo !== 'string') {
      return 'INVALID'
    }
    phoneNo = phoneNo.replace(/\D/g, '')
    if (phoneNo.length !== 11) {
      phoneNo = '1' + phoneNo
    }
    return phoneNo
  }

  public async create(createPatientDto: CreatePatientDto) {
    const phoneNo = this.sanitizePhoneNo(createPatientDto.phoneNo)
    const patient = new this.patientModel({ ...createPatientDto, phoneNo })
    patient.save()
    return patient
  }

  public async findAll(skip: number, limit: number, query: any) {
    let filters = {}
    const sorts = this.deserializeSortModel(query)
    if (query?.filters === 'true') {
      filters = this.deserializeFilterModel(query)
    }
    const patients = await this.patientModel
      .find({ ...filters })
      .sort(Object.keys(sorts)?.length ? sorts : { lastName: 1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const count = await this.patientModel.countDocuments()
    return { patients, count }
  }

  public async findOne(id: string) {
    return await this.patientModel.findById(id)
  }

  /*
   ** map properties specified in the gird's filter model to properties in the patient model
   */

  private mapKey(key: string) {
    const mapping = {
      status: 'highestSeverityOfMostRecentScreener',
      name: 'lastName',
    }
    return mapping[key] || key
  }

  private getSortDirection(sort: string) {
    switch (sort) {
      case 'asc':
        return 1
      case 'desc':
        return -1
      default:
        return 1
    }
  }

  /*
   ** isolate sorts from query
   */

  public deserializeSortModel(query: any) {
    console.log('query in isolate', query)
    //check if query object contains sorts
    if (query?.sorts !== 'true') {
      return {}
    }
    const params = Object.entries(query)
    const sorts = {}
    params.forEach(([key, value]) => {
      if (value === 'asc' || value === 'desc') {
        sorts[this.mapKey(key)] = this.getSortDirection(value)
      }
    })
    return sorts
  }

  /*
   ** convert seriealized filter model into a mongoose query object
   */

  private deserializeFilterModel(data: any) {
    delete data?.filters?.skip
    delete data?.filters?.limit
    delete data?.filters?.filters
    const filters = {}
    const items = Object.entries(data)
    items.forEach(([key, value]) => {
      const tokens = (value as string).split('~')
      const operator = tokens[0]
      const fieldValue = tokens[1]

      if (operator === 'contains') {
        filters[this.mapKey(key)] = fieldValue
      }
    })
    return filters
  }

  public async findByProviderId(
    id: string,
    skip: number,
    limit: number,
    query: any,
  ) {
    const personnel = await this.personnelService.findOne(id)
    if (!personnel) {
      return new NotFoundException('Provider not found: findByProviderId')
    }
    let filters = {}
    const sorts = this.deserializeSortModel(query)
    if (query?.filters === 'true') {
      filters = this.deserializeFilterModel(query)
    }
    const patients = await this.patientModel
      .find({ providerId: id, ...filters })
      .sort(Object.keys(sorts)?.length ? sorts : { lastName: 1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const count = await this.patientModel.countDocuments({ providerId: id })
    return { patients, count }
  }

  public async search(name: string, skip: number, limit: number, query: any) {
    let filters = {}
    const sorts = this.deserializeSortModel(query)
    if (query?.filters === 'true') {
      filters = this.deserializeFilterModel(query)
    }
    const patients = await this.patientModel
      .find({
        $or: [
          { lastName: { $regex: name, $options: 'i' } },
          { firstName: { $regex: name, $options: 'i' } },
        ],
        ...filters,
      })
      .sort(Object.keys(sorts)?.length ? sorts : { lastName: 1 })
      .skip(skip)
      .limit(limit)
      .exec()
    const count = await this.patientModel.countDocuments()
    return { patients, count }
  }

  public async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findOne(id)
    if (updatePatientDto.firstName) {
      patient.firstName = updatePatientDto.firstName
    }
    if (updatePatientDto.lastName) {
      patient.lastName = updatePatientDto.lastName
    }
    if (updatePatientDto.phoneNo) {
      patient.phoneNo = this.sanitizePhoneNo(updatePatientDto.phoneNo)
    }
    if (updatePatientDto.email) {
      patient.email = updatePatientDto.email
    }
    if (updatePatientDto.dob) {
      patient.dob = updatePatientDto.dob
    }
    if (updatePatientDto.dateOfMostRecentScreener) {
      patient.dateOfMostRecentScreener =
        updatePatientDto.dateOfMostRecentScreener
    }
    if (updatePatientDto.highestSeverityOfMostRecentScreener) {
      patient.highestSeverityOfMostRecentScreener =
        updatePatientDto.highestSeverityOfMostRecentScreener
    }
    if (updatePatientDto.providerId) {
      const personnel = await this.personnelService.findOne(
        updatePatientDto.providerId,
      )
      if (!personnel) {
        return new NotFoundException('Provider not found: findByProviderId')
      }
      patient.providerId = personnel
    }
    patient.save()
    return patient
  }

  remove(id: number) {
    return `This action removes a #${id} patient`
  }
}
