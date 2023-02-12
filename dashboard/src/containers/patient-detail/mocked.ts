import { IPatient, IPatientReferral, IScreenResult } from 'types'

export const mockedPatient: IPatient = {
  id: 'angel_hernandez',
  firstName: 'Angel',
  lastName: 'Hernandez',
  email: 'angel@gmail.com',
  phoneNo: '650-200-1234',
  dob: new Date(1999, 2, 3),
}

export const patientResults: IScreenResult[] = [
  {
    id: 'result-1',
    patientId: 'patient-1',
    answers: [
      {
        type: 'GAD-7',
        score: 18,
        details: [
          {
            question: 'Feeling nervous, anxious or on edge',
            answer: 'Nearly every day',
          },
          {
            question: 'Not being able to stop or control worrying',
            answer: 'More than half the days',
          },
          {
            question: 'Worrying too much about different things',
            answer: 'More than half the days',
          },
          {
            question: 'Trouble relaxing',
            answer: 'Several days',
          },
          {
            question: "Being so restless that it's hard to sit still",
            answer: 'Several days',
          },
          {
            question: 'Becoming easily annoyed or irritable',
            answer: 'Not at all',
          },
          {
            question: 'Feeling afraid as if something awful might happen',
            answer: 'Not at all',
          },
        ],
      },
      {
        type: 'PHQ-9',
        score: 12,
        details: [
          {
            question: 'Little interest or pleasure in doing things?',
            answer: 'Nearly every day',
          },
          {
            question: 'Feeling down, depressed, or hopeless?',
            answer: 'More than half the days',
          },
          {
            question: 'Trouble sleeping/sleeping too much?',
            answer: 'More than half the days',
          },
          {
            question: 'Feeling tired or having little energy?',
            answer: 'Several days',
          },
          { question: 'Poor appetite or overeating?', answer: 'Several days' },
          { question: 'Feeling bad about yourself', answer: 'Not at all' },
          { question: 'Trouble concentrating on things', answer: 'Not at all' },
          {
            question: 'Moving/speaking slowly or fidgety/restless',
            answer: 'Not at all',
          },
          {
            question: 'Thinking you’d be better off dead/hurting self',
            answer: 'Not at all',
          },
        ],
      },
      {
        type: 'EPDS',
        score: 1,
        isHighRisk: true,
        details: [
          {
            question: 'Been able to laugh and see the funny side of things',
            answer: 'As much as I always could',
          },
          {
            question: 'Looked forward with enjoyment to things',
            answer: 'Rather less than I used to',
          },
          {
            question: 'Blamed myself unnecessarily when things went wrong',
            answer: 'Yes, some of the time',
          },
          {
            question: 'Been anxious or worried for no good reason',
            answer: 'Hardly ever',
          },
          {
            question: 'Felt scared or panicky for no very good reason',
            answer: 'Yes, sometimes ',
          },
          {
            question: 'Things have been getting on top of me',
            answer: 'No, most of the time I have coped quite well ',
          },
          {
            question: 'Been so unhappy that I have had difficulty sleeping',
            answer: 'Not at all',
          },
          {
            question: 'Been so unhappy that I have been crying',
            answer: 'Not at all',
          },
          {
            question: 'Felt sad or miserable',
            answer: 'Not at all',
          },
          {
            question: 'Thought of harming myself has occurred to me ',
            answer: 'Not at all',
          },
        ],
      },
    ],
    status: 'Completed',
    source: 'Text Message',
    createdAt: new Date(),
  },
  {
    id: 'result-2',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 4, details: [] },
      { type: 'PHQ-9', score: 12, details: [] },
    ],
    status: 'Completed',
    source: 'Text Message',
    createdAt: new Date(),
  },
  {
    id: 'result-3',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 18, details: [] },
      { type: 'PHQ-9', score: 12, details: [] },
    ],
    status: 'Completed',
    source: 'Email',
    createdAt: new Date(),
  },
  {
    id: 'result-4',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 3, details: [] },
      { type: 'PHQ-2', score: 2, details: [] },
    ],
    status: 'Completed',
    source: 'In-person (QR)',
    createdAt: new Date(),
  },
  {
    id: 'result-5',
    patientId: 'patient-1',
    answers: [],
    status: 'Incomplete',
    source: 'In-person (QR)',
    createdAt: new Date(),
  },
  {
    id: 'result-6',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 18, details: [] },
      { type: 'PHQ-9', score: 12, details: [] },
    ],
    status: 'Completed',
    source: 'Text Message',
    createdAt: new Date(),
  },
  {
    id: 'result-7',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 4, details: [] },
      { type: 'PHQ-9', score: 12, details: [] },
    ],
    status: 'Completed',
    source: 'Text Message',
    createdAt: new Date(),
  },
  {
    id: 'result-8',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 18, details: [] },
      { type: 'PHQ-9', score: 12, details: [] },
    ],
    status: 'Completed',
    source: 'Email',
    createdAt: new Date(),
  },
  {
    id: 'result-9',
    patientId: 'patient-1',
    answers: [
      { type: 'GAD-7', score: 3, details: [] },
      { type: 'PHQ-2', score: 2, details: [] },
    ],
    status: 'Completed',
    source: 'In-person (QR)',
    createdAt: new Date(),
  },
  {
    id: 'result-10',
    patientId: 'patient-1',
    answers: [],
    status: 'Incomplete',
    source: 'In-person (QR)',
    createdAt: new Date(),
  },
]

export const patientReferrals: IPatientReferral[] = [
  {
    id: 'referral-1',
    patientId: 'patient-1',
    createdAt: new Date(),
    description: 'Patient referral request was submitted to Amy Tran.',
  },
  {
    id: 'referral-2',
    patientId: 'patient-1',
    createdAt: new Date(2022, 0, 7),
    description: 'Patient referral sent more than a week ago.',
  },
]
