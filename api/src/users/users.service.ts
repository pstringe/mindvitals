import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'
import { OrganizationsService } from 'organizations/organizations.service'
import { PersonnelService } from 'personnel/personnel.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './user.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly orgService: OrganizationsService,
    private readonly personnelService: PersonnelService,
  ) {}

  public async addUser(userDto: CreateUserDto) {
    const salt = await bcrypt.genSalt()
    const org = await this.orgService.findOne(userDto.organization)
    const password = await bcrypt.hash(userDto.password.toString(), salt)
    console.log('user', userDto);
    const user = new this.userModel({
      ...userDto,
      username: typeof userDto?.username == 'string' ? userDto?.username?.toLowerCase() : userDto?.username,
      organization: org?.id,
      password,
    })
    let personnel = null
    if (userDto.personnel) {
      personnel = await this.personnelService.create({
        organizationId: org?.id,
        userId: user.id,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
      })
      user.personnel = personnel
    } else {
      user.personnel = null
    }
    user.save()
    return user
  }

  public async getUsers() {
    const users = this.userModel.find().exec()
    return users
  }

  public async getUserById(id: string) {
    let user
    try {
      user = await this.findUserById(id)
    } catch (error) {
      throw new NotFoundException('User not found: getUserById')
    }
    return user
  }

  public async updateUser(id: string, userDto: CreateUserDto) {
    const updatedUser = await this.findUserById(id)
    if (userDto.username) {
      updatedUser.username = userDto.username.toLowerCase()
    }
    if (userDto.firstName) {
      updatedUser.firstName = userDto.firstName
    }
    if (userDto.lastName) {
      updatedUser.lastName = userDto.lastName
    }
    if (userDto.password) {
      const salt = await bcrypt.genSalt()
      updatedUser.password = await bcrypt.hash(userDto.password, salt)
    }
    if (userDto.organization) {
      updatedUser.organization = userDto.organization
    }
    updatedUser.save()
    return updatedUser
  }

  public async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException('User not Found: findUserById')
    }
    return user
  }

  public async findUserByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username })
    if (!user) {
      throw new NotFoundException('User not Found: findUserByUsername')
    }
    return user
  }
  
  public async findOne(query: Record<string, unknown>): Promise<UserDocument> {
    const user = await this.userModel.findOne(query)
    if (!user) {
      throw new NotFoundException('User not Found: findOne')
    }
    return user
  }

  public async deleteUser(id: string) {
    const res = await this.userModel.deleteOne({ _id: id }).exec()
    if (!res) {
      throw new NotFoundException('User not Fount: deleteUser')
    }
    return null
  }
}
