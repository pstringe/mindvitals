import { Controller, Post, Get, Request, UseGuards, Res } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from './jwt-auth.guard'
import { AuthService } from './auth.service'


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@Res({ passthrough: true }) res, @Request() req): any {
        const login = this.authService.login(res, req?.user);
        return login;
    }
    
    @Get('logout')
    logout(@Res({ passthrough: true }) res): any {
        return this.authService.logout(res);
    }
}
