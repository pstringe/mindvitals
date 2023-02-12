import { Controller, Post, Body } from '@nestjs/common'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { SendResultsDto } from './dto/send-results.dto'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/send-results')
  sendResults(@Body() sendResultsDto) {
    return this.notificationsService.sendResults(sendResultsDto)
  }

  @Post('/send-referal')
  sendReferal(@Body() sendResultsDto: SendResultsDto) {
    return this.notificationsService.sendReferal(sendResultsDto)
  }

  @Post('/send-screener-request')
  sendScreenerRequest(@Body() sendResultsDto) {
    return this.notificationsService.sendScreenerRequest(sendResultsDto)
  }

  @Post('/send-forgot-password')
  sendForgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    //return this.notificationsService.sendForgotPasswordEmail(forgotPasswordDto.email);
  }
}
