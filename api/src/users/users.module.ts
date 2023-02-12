import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrganizationsModule } from 'organizations/organizations.module'
import { PersonnelModule } from 'personnel/personnel.module'

import { UserSchema } from './user.model'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'global'),
    OrganizationsModule,
    PersonnelModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
