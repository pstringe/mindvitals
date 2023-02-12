import { PinpointClient, SendMessagesCommand } from '@aws-sdk/client-pinpoint'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { config, Pinpoint } from 'aws-sdk'

@Injectable()
export class AwsSdkService {
  private credentials
  private pinpointClient
  private REGION = 'us-west-2'
  private PINPOINT_PROJECT_ID = 'e738a3b619bf42fc9020aa49c6af0f74'
  private SENDER_EMAIL_ADDRESS = 'hello@prairiehealth.co'

  constructor(private readonly httpService: HttpService) {
    config.getCredentials(() => {
      this.credentials = config.credentials
      console.log('credentials', this.credentials);
    })
    config.update({ region: 'us-west-2' })
    this.setPinpointClient()
  }

  public getRegion() {
    return config.region
  }

  public getCredentials() {
    return this.credentials
  }

  public getPinpoint() {
    return new Pinpoint()
  }

  public addAWSPinpointEndpoint(endpointId, channel, address, user) {
    const APPLICATION_ID = ''
    const request = `/v1/apps/${APPLICATION_ID}/endpoints/${endpointId}`
    const payload = {
      ChannelType: channel,
      Address: address,
      User: {
        UserId: user,
      },
    }
    this.httpService.put(request, payload)
  }

  private setPinpointClient() {
    this.pinpointClient = new PinpointClient({ region: this.REGION })
  }

  public getPinpointClient() {
    return this.pinpointClient()
  }

  public async sendSMS(message) {
    const { DestinationNumber, ...smsParams } = message
    const params = this.getSMSParams(message)
    this.sendMessage(params, DestinationNumber)
  }

  public async sendEmail(toAddress, subjectLine, body_text, body_html) {
    const params = this.getEmailParams(
      toAddress,
      subjectLine,
      body_text,
      body_html,
    )
    this.sendMessage(params, toAddress)
  }

  private async sendMessage(params, recipient) {
    try {
      const data = await this.pinpointClient.send(
        new SendMessagesCommand(params),
      )
      console.log('data', data)
      return data
    } catch (err) {
      console.log('Error', err)
    }
  }

  private getSMSParams(message) {
    const { DestinationNumber, ...smsParams } = message
    const params = {
      ApplicationId: this.PINPOINT_PROJECT_ID,
      MessageRequest: {
        Addresses: {
          [DestinationNumber]: {
            ChannelType: 'SMS',
          },
        },
        MessageConfiguration: {
          SMSMessage: { ...smsParams },
        },
      },
    }
    return params
  }

  private getEmailParams(toAddress, subjectLine, body_text, body_html) {
    const charset = 'UTF-8'
    const params = {
      ApplicationId: this.PINPOINT_PROJECT_ID,
      MessageRequest: {
        Addresses: {
          Destination: {
            ToAddresses: toAddress,
          },
          [toAddress]: {
            ChannelType: 'EMAIL',
          },
        },
        MessageConfiguration: {
          EmailMessage: {
            FromAddress: this.SENDER_EMAIL_ADDRESS,
            SimpleEmail: {
              Subject: {
                Charset: charset,
                Data: subjectLine,
              },
              HtmlPart: {
                Charset: charset,
                Data: body_html,
              },
              TextPart: {
                Charset: charset,
                Data: body_text,
              },
            },
          },
        },
      },
    }
    return params
  }
}
