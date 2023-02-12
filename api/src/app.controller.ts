import { Controller, Post, Get, Request, UseGuards, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Get()
  getHello() {
    return { response: 'success' }
  }
}
