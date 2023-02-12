import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateOrganizationDto } from './dto/create-organization.dto'
import { UpdateOrganizationDto } from './dto/update-organization.dto'
import { Organization, OrganizationDocument } from './entities/clinic.entity'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel('Organization')
    private readonly organizationModel: Model<Organization>,
  ) {}
  private activeOrganizationId: string

  public getActiveOrganizationId() {
    return this.activeOrganizationId
  }

  public setActiveOrganizationId(id: string) {
    this.activeOrganizationId = id
  }

  public async create(createClinicDto: CreateOrganizationDto) {
    const clinic = new this.organizationModel({ ...createClinicDto })
    const result = await clinic.save()
    return result
  }

  public async findAll() {
    const clinics = this.organizationModel.find().exec()
    return clinics
  }

  public async findOne(id: any) {
    const clinic = await this.organizationModel.findById(id)
    if (!clinic) {
      throw new NotFoundException(`Organization with ID "${id}" not found`)
    }
    return clinic;
  }

  public async update(id: string, updateClinicDto: UpdateOrganizationDto) {
    const updatedClinic = await this.findOne(id);
    if (updateClinicDto?.name) {
      updatedClinic.name = updateClinicDto.name
    }
    if (updateClinicDto?.connection) {
      updatedClinic.connection = updateClinicDto.connection
    }
    if (updateClinicDto?.logo) {
      updatedClinic.logo = updateClinicDto.logo
    }
    updatedClinic.save()
    return updatedClinic
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`
  }
}
