import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { AwsSdkService } from './aws-sdk.service'

@Module({
  imports: [HttpModule],
  providers: [AwsSdkService],
  exports: [AwsSdkService],
})
export class AwsSdkModule {}
