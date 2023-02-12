import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { UpdateForgotPasswordDto } from './dto/update-forgot-password.dto';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Get(':email')
  forgot(@Param('email') email: string) {
    console.log(email);
    return this.forgotPasswordService.forgotPassword(email);
  }

  @Post('/reset/:email/:token')
  resetPassword(@Param('email') email: string, @Param('token') token: string, @Body() updateForgotPasswordDto: UpdateForgotPasswordDto) {
    let emailDecoded = decodeURIComponent(email);
    emailDecoded = emailDecoded.replace(/\$2E/g, '.');
    const tokenDecoded = decodeURIComponent(token);
    return this.forgotPasswordService.resetPassword(emailDecoded, tokenDecoded, updateForgotPasswordDto);
  }
}