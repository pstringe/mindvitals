import { ApiProperty } from '@nestjs/swagger'

export class CreateQuestionnaireDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  resultHeading: string

  @ApiProperty()
  questions: {prompt: string, answerSetIndex: number}[]

  @ApiProperty()
  answerSets: {choice: string, pointValue: number}[][]

  @ApiProperty()
  length: number

  @ApiProperty()
  scoringScale: object
}
