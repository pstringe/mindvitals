export class SendResultsDto {
  method: 'sms' | 'email'
  patient: string
  batch?: string
  description?: string
}
