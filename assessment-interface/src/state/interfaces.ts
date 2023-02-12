export interface Assessment {
    answers: number[];
    patientId?: string;
    questionnaire?: string;
    passingThreshold: number;
    resultHeading: string;
    score: number;
    severity: string;
    type?: string;
    _id: string;
}

export interface AssessmentQuestion {
    assessmentId: string;
    assessmentIndex: number;
    assessmentTitle: string;
    prompt: string;
    choices: any[];
    answer: number;
    batchIndex: number;
    terminating: boolean;
}

export interface Batch {
    questions: AssessmentQuestion[];
    assessments: Assessment[];
    patient: string;
    anonymousUser: any;
    completed: boolean;
    modifyDate: string;
    _id: string;
}

export interface alertInterface {
    message: string;
    title: string;
}

export interface Patient {
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    dob: Date | null;
    dateOfMostRecentScreener: Date;
    highestSeverityOfMostRecentScreener: string;
    providerId: string;
}

export interface State {
    authorization: object;
    assessmentBatch: Batch;
    questions: AssessmentQuestion[];
    questionIndex: number;
    results: any;
    isLoading: boolean;
    showNext: boolean;
    agreementValues: boolean[];
    dob: Date;
    showAlert: boolean;
    patient: Patient;
    alert: alertInterface;
    logo: string;
}

export interface Action {
    type: string;
    slice: 'authorization' | 'assessmentBatch' | 'questions' | 'questionIndex' | 'results' | 'isLoading' | 'showNext' | 'agreementValues' | 'dob' | 'showAlert' | 'alert' | 'patient' | 'files';
    payload?: any;
}