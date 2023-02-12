import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import * as Express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'

const server = Express()

server.get('/', (req, res) => {
  res.send('Hello Google!')
})

server.get('/_ah/health', (req, res) => {
  res.send('OK')
})

async function bootstrap() {
  const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://midvitalspatientinterfacestaging-dot-cynomys-nonprod.df.r.appspot.com',
    'https://midvitalspatientinterfacestaging-dot-mindvitals-nonprod.wl.r.appspot.com',
    'https://mindvitalsproviderdashboard-dot-mindvitals-nonprod.wl.r.appspot.com',
    'https://midvitalsproviderdashboard-dot-mindvitals-prod.wl.r.appspot.com',
    'https://midvitalspatientinterfacestaging-dot-mindvitals-prod.wl.r.appspot.com',
    'https://portal.mindvitals.io',
    'https://screening.mindvitals.io'
  ]

  console.log(`whitelist: ${whitelist}`);
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
  app.enableCors({ origin: whitelist, credentials: true })
  app.use(cookieParser())
  const config = new DocumentBuilder()
    .setTitle('Mindvitals API')
    .setDescription('Mindvitals API for engineering team')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(process.env.PORT || 8080)
}
bootstrap()
