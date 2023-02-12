import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreatePersonnelDto } from './dto/create-personnel.dto'
import { UpdatePersonnelDto } from './dto/update-personnel.dto'
import { Personnel, PersonnelDocument } from './entities/personnel.entity'

@Injectable()
export class PersonnelService {
  constructor(
    @InjectModel('Personnel') private readonly personnelModel: Model<Personnel>,
  ) {}

  public async create(createPersonnelDto: CreatePersonnelDto) {
    const personnel = new this.personnelModel({ ...createPersonnelDto })
    const result = await personnel.save()
    return result
  }

  public async findAll() {
    const personnel = await this.personnelModel.find().exec()
    return personnel
  }

  public async findPersonnel(query: object): Promise<PersonnelDocument> {
    const personnel = await this.personnelModel.find(query).exec()
    if (!personnel) {
      throw new NotFoundException('Personnel Not found: findUser')
    }
    return personnel[0]
  }

  public async findOne(id: string) {
    let personnel: PersonnelDocument
    try {
      personnel = await this.personnelModel.findById(id)
      console.log('id', id, 'personnel', personnel)
    } catch (error) {
      throw new NotFoundException(error)
    }
    return personnel
  }

  public async updatePersonnel(
    id: string,
    updatePersonnelDto: UpdatePersonnelDto,
  ) {
    const personnel: any = await this.findPersonnel({ _id: id })
    if (updatePersonnelDto.userId) {
      personnel.userId = updatePersonnelDto.userId
    }
    if (updatePersonnelDto.firstName) {
      personnel.firtsName = updatePersonnelDto.firstName
    }
    if (updatePersonnelDto.lastName) {
      personnel.lastName = updatePersonnelDto.lastName
    }
    if (updatePersonnelDto.organizationId) {
      personnel.organizationId = updatePersonnelDto.organizationId
    }
    personnel.save()
    return personnel
  }

  remove(id: number) {
    return `This action removes a #${id} personnel`
  }
}
