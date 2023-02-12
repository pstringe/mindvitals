import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from 'users/users.service'
import { AwsSdkService } from '../aws-sdk/aws-sdk.service'
import { BatchService } from '../batch/batch.service'
import { PatientsService } from '../patients/patients.service'
import { SendResultsDto } from './dto/send-results.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { OrganizationsService } from 'organizations/organizations.service'

@Injectable()
export class NotificationsService {
  private readonly REFERAL_CONTACT_EMAIL = 'hello@prairiehealth.co'

  constructor(
    private readonly aws: AwsSdkService,
    private readonly patientService: PatientsService,
    private readonly batchService: BatchService,
    private readonly config: ConfigService,
    private readonly organizationService: OrganizationsService,
    private readonly usersService: UsersService,
  ) {}

  public getConfig() {
    return {
      credentials: this.aws.getCredentials(),
      region: this.aws.getRegion(),
    }
  }

  private getProviderBaseURL() {
    const env = this.config.get('CURRENT_ENV');
    let baseUrl = ''
    if (env == 'local') {
      baseUrl = 'http://localhost:3000';
    } else if (env == 'staging') {
      baseUrl = 'https://mindvitalsproviderdashboard-dot-mindvitals-nonprod.wl.r.appspot.com';
    } else if (env == 'production') {
      baseUrl = 'https://portal.mindvitals.io';
    }
    return baseUrl;
  }

  private getBaseURL() {
    const env = this.config.get('CURRENT_ENV');
    console.log('env', env)
    let baseUrl = ''
    if (env == 'local') {
      baseUrl = this.config.get('BASE_URL_LOCAL')
    } else if (env === 'staging') {
      baseUrl = this.config.get('BASE_URL_STAGING')
    } else if (env === 'production') {
      baseUrl = this.config.get('BASE_URL_PRODUCTION');
    }
    console.log('baseUrl', baseUrl);
    return baseUrl
  }

  private generateLink(batchId) {
    let baseUrl = this.getBaseURL()
    return `${baseUrl}/results/${batchId}`
  }

  private generateScreenerLink(batchId) {
    let baseUrl = this.getBaseURL();
    return `${baseUrl}/${batchId}`;
  }

  private generateEmailResultsHTML(batch) {
    let html = `<h1>Mental Health Assessment Results</h1>`
    html += `<p>Thank you for taking the Mental Health Assessment. Your results are below.</p>`
    html += `<p>Please click the link below to view your results.</p>`
    html += `<p><a href="${this.generateLink(batch._id)}">View Results</a></p>`
    return html
  }

  
  private generateSMSResultsCopy = batch => {
    return `Thank you for taking the Mental Health Assessment. Your results are below.
    Please click the link below to view your results.
    ${this.generateLink(batch._id)}`
  }

  private generateEmailResultsBody = batch => {
    let body = `Thank you for taking the Mental Health Assessment. Your results are below.`
    body += `Please click the link below to view your results.`
    body += `${this.generateLink(batch._id)}`
    return body
  }

  private generateEmailReferalBody = (patient, batch, description) => {
    let body;
    if (batch) {
      body = `${patient.firstName} ${patient.lastName} just completed the Mental Health Assessment. Their results are below.`
      body += `Please click the link below to view their results.`
      body += `${this.generateLink(batch._id)}`
    } else {
      body = `${patient.firstName} ${patient.lastName} is being referred by a provider for the following reason:`
      body += `${description}`
    }
    return body
  }

  private generateEmailReferalHTML = (patient, batch, reason) => {
    let html;
    if (batch) {
    html= `<h1>Mental Health Assessment Results</h1>`
    html += `<p>${patient.firstName} ${patient.lastName} just completed the Mental Health Assessment. Their results are below.</p>`
    html += `<p>Please click the link below to view their results.</p>`
    html += `<p><a href="${this.generateLink(batch._id)}">View Results</a></p>`
    } else {
      html = `<h1>Mental Health Assessment Referral</h1>`
      html += `<p>${patient.firstName} ${patient.lastName} is being referred by a provider for the following reason:</p>`
      html += `<p>${reason}</p>`
    }
    return html
  }

  
  private generateEmailRequestScreenerBody ( patieint, batch ) {
    let body = `Hello ${patieint.firsName}, 
    Your doctor has requested that you take a Mental Health Assessment.
    You can find the assessment at ${this.generateScreenerLink(batch._id)}`
    return body
  }

  private generateEmailRequestScreenerHTML ( patient, batch ) {
    let html = `<h1>Mental Health Assessment Screener Request</h1>`
    html += `
    <p>Hello ${patient.firstName},</p>
    <p>Your doctor has requested that you take a Mental Health Assessment.
    You can find the assessment at ${this.generateScreenerLink(batch._id)}`
    return html
  }

  private generateSMSRequestScreenerCopy = (patient, batch) => {
    return `Hello, ${patient.firstName}
    Your doctor has requested that you take a Mental Health Assessment.
    You can find the assessment at ${this.generateScreenerLink(batch._id)}`
  }

  private encode(s: string) {
    //replace . with %2E
    return encodeURIComponent(s.replace(/\./g, '%2E'));

  }

  public async sendForgotPasswordEmail(email, token) {
    const recipient = email;
    const subject = 'Mindvitals Password Reset'
    const link = `${this.getProviderBaseURL()}/reset-password/${this.encode(email)}/${this.encode(token)}`;
    const body = `You have requested to reset your password. Please click the link below to reset your password.
                  ${link}`
    const html = `<p>You have requested to reset your password. Please click the link below to reset your password.</p>
    <p><a href="${link}">Reset Password</a></p>`
    await this.aws.sendEmail(recipient, subject, body, html);
    return {};
  }

  public async sendResults(sendResultsDto: SendResultsDto) {
    const patient = await this.patientService.findOne(sendResultsDto.patient)
    if (!patient) {
      return new NotFoundException('Patient could not be found')
    }
    const batch = await this.batchService.findOne(sendResultsDto.batch)
    if (!batch) {
      return new NotFoundException('Batch could not be found')
    }
    if (sendResultsDto.method == 'sms') {
      const message = {
        Body: this.generateSMSResultsCopy(batch),
        MessageType: 'TRANSACTIONAL',
        SenderId: 'Prairie Health',
        DestinationNumber: patient.phoneNo,
        Keyword: 'Test',
      }
      console.log('message', message)
      const res = await this.aws.sendSMS(message);
      console.log('res', res);

      return { destination: patient.phoneNo }
    }
    if (sendResultsDto.method == 'email') {
      const recipient = patient.email
      const subject = 'Mental Health Assessment Results'
      const body = this.generateEmailResultsBody(batch)
      const html = this.generateEmailResultsHTML(batch)
      await this.aws.sendEmail(recipient, subject, body, html)
      return { destination: patient.email }
    } 
  }

  public async sendReferal(sendResultsDto: SendResultsDto) {
    const patient = await this.patientService.findOne(sendResultsDto.patient)
    if (!patient) {
      return new NotFoundException('Patient could not be found')
    }
    const batch = sendResultsDto.batch && await this.batchService.findOne(sendResultsDto.batch)
    const org = await this.organizationService.findOne(this.organizationService.getActiveOrganizationId());
    console.log('org', org);
    let subject = 'New Referal Coordination Request';
    if (org){
      subject += ` from ${org.name}`
    } 
    if (sendResultsDto.method == 'email') {
      const recipient = this.REFERAL_CONTACT_EMAIL
      const body = this.generateEmailReferalBody(patient, batch, sendResultsDto.description);
      const html = this.generateEmailReferalHTML(patient, batch, sendResultsDto.description);
      await this.aws.sendEmail(recipient, subject, body, html)
      return { destination: this.REFERAL_CONTACT_EMAIL }
    }
  }

  public async sendScreenerRequest(sendScreenerRequestDto: SendResultsDto) {
    const patient = await this.patientService.findOne(sendScreenerRequestDto.patient)
    if (!patient) {
      return new NotFoundException('Patient could not be found')
    }
    const batch = await this.batchService.findOne(sendScreenerRequestDto.batch)
    if (!batch) {
      return new NotFoundException('Batch could not be found')
    }
    if (sendScreenerRequestDto.method == 'email') {
      const recipient = patient.email
      const subject = 'Mental Health Assessment Screener Request'
      const body = this.generateEmailRequestScreenerBody(patient, batch)
      const html = this.generateEmailRequestScreenerHTML(patient, batch)
      await this.aws.sendEmail(recipient, subject, body, html)
      return { destination: patient.email }
    }
    if (sendScreenerRequestDto.method == 'sms') {
      const message = {
        Body: this.generateSMSRequestScreenerCopy(patient, batch),
        MessageType: 'TRANSACTIONAL',
        SenderId: 'Prairie Health',
        DestinationNumber: patient.phoneNo,
        Keyword: 'Test',
      }
      await this.aws.sendSMS(message)
      return { destination: patient.phoneNo }
    }
  }
}
