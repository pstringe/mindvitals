import { ApiProperty } from "@nestjs/swagger";

export class CreateReferralDto {
    @ApiProperty()
    patientId: string;

    @ApiProperty()
    providerId: string;

    @ApiProperty()
    referralDate: Date;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    method?: 'sms' | 'email';

    @ApiProperty()
    batchId?: string;
}
