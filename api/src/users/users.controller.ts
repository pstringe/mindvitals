import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.model'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this.userService.getUsers()
    return users
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id)
    return user
  }

  @Post('add')
  async addUser(@Body() userDto: CreateUserDto): Promise<User> {
    console.log('addUser')
    const user = await this.userService.addUser(userDto)
    return user
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() userDto: CreateUserDto): any {
    const user = this.userService.updateUser(id, userDto)
    return user
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string): any {
    return this.userService.deleteUser(id)
  }
}
