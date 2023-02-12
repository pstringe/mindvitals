import { PartialType } from '@nestjs/swagger';
import { CreateForgotPasswordDto } from './create-forgot-password.dto';

export class UpdateForgotPasswordDto extends PartialType(CreateForgotPasswordDto) {}
