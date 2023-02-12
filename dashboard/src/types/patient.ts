import { IPatient } from './user'

export interface IScreenResultAnswerDetail {
  question: string
  answer: string
}

export interface IAssessment {
  _id: string
  type: 'PHQ-2' | 'PHQ-9' | 'GAD-7' | 'EPDS'
  resultHeading: string
  questionnaire: string
  patientId: string
  anonymousUser: string
  answers: number[]
  score: number
  severity: string
  passingThreshold: number
  complete: boolean
}

export interface IScreener {
  _id: string
  createDate: Date
  modifyDate: Date
  highestSeverity: string
  assessments: []
  questions: IQuestion[]
  anonymousUser: string
  patient: string
  personnel: string
  completed: boolean
  requestMethod: string
  patientFirstName?: string
  patientLastName?: string
}

export interface IQuestion {
  assessmentId: string
  assessmentIndex: number
  assessmentTitle: string
  prompt: string
  choices: {choice: string, pointValue: number}[]
  answer: number
  batchIndex: number
  terminating: boolean
}

export interface IScreenResultAnswer {
  type: 'PHQ-2' | 'PHQ-9' | 'GAD-7' | 'EPDS'
  isHighRisk?: boolean
  score: number
  details: IScreenResultAnswerDetail[]
}

export interface IScreenResult {
  id: string
  name?: string
  patientId: string
  createdAt: Date
  answers: IScreenResultAnswer[]
  status: 'Completed' | 'Incomplete'
  source: string
}

export interface IPatientReferral {
  id: string
  patientId: string
  createdAt: Date
  description: string
}

export interface IPatientRow extends IPatient {
  name: string
  status: string
  screenerLastSent: string
  profile: string
}
