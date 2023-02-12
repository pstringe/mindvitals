import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AwsSdkModule } from 'aws-sdk/aws-sdk.module'
import { BatchModule } from 'batch/batch.module'
import { PatientsModule } from 'patients/patients.module'
import { UsersModule } from 'users/users.module'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [ConfigModule, AwsSdkModule, PatientsModule, BatchModule, UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
