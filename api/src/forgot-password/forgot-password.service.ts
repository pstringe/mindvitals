import { Injectable, Scope } from '@nestjs/common';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';
import { UsersService } from 'users/users.service';
import { NotificationsService } from 'notifications/notifications.service';
import * as bcrypt from 'bcryptjs'

@Injectable({scope: Scope.DEFAULT})
export class ForgotPasswordService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService
  ) {}

  private async generateResetToken(user: any) {
    const plaintext = user.username + user._id
    const token = await bcrypt.hash(plaintext, 10);
    return token;
  }

  public async forgotPassword(email: string) {
    const user = await this.usersService.findUserByUsername(email)
    if (!user) {
      return {};
    }
    const token = await this.generateResetToken(user);
    this.notificationsService.sendForgotPasswordEmail(email, token);
    return {};
  }
  
  public async resetPassword(email: string, token: string, updateForgotPasswordDto: UpdateForgotPasswordDto) {
    const user = await this.usersService.findUserByUsername(email)
    if (!user) {
      return {};
    }
    const plaintext = user.username + user._id
    const isValid = await bcrypt.compare(plaintext, token);
    if (!isValid) {
      return {};
    }
    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(updateForgotPasswordDto.password.toString(), salt)
    user.password = password
    user.save()
    return {};
  }
}
