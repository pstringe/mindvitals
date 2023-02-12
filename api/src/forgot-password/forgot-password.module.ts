import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { NotificationsModule } from 'notifications/notifications.module';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule
  ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService]
})
export class ForgotPasswordModule {}
