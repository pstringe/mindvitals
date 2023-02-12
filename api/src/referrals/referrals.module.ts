import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralSchema } from './entities/referral.entity';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Referral', schema: ReferralSchema }],
      'clinic',
    ),
    NotificationsModule,
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService]
})
export class ReferralsModule {}
