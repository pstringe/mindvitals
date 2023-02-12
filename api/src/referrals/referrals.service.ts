import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { Referral } from './entities/referral.entity';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel('Referral') private readonly referralModel: Model<Referral>,
    private readonly notificationService: NotificationsService,
  ) {}

  public async create(createReferralDto: CreateReferralDto) {
    console.log('refer', createReferralDto);
    const referral = await new this.referralModel({ ...createReferralDto, referralDate: new Date() });
    referral.save();
    
    console.log('referral', referral);
    const notification = await this.notificationService.sendReferal({
      patient: createReferralDto.patientId,
      method: createReferralDto.method,
      description: createReferralDto.description,
      batch: createReferralDto.batchId,
    })
    console.log('notification', notification);
    return { referral, notification };
  }

  findAll() {
    const referrals = this.referralModel.find().exec();
    return referrals;
  }

  findByPatientId(id: string) {
    return this.referralModel.find({ patientId: id });
  }

  findOne(id: number) {
    return `This action returns a #${id} referral`;
  }

  update(id: number, updateReferralDto: UpdateReferralDto) {
    return `This action updates a #${id} referral`;
  }

  remove(id: number) {
    return `This action removes a #${id} referral`;
  }
}
