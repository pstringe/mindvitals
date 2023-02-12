import { axios, 
   LOGIN_REQUEST, 
   ASSESSMENTS, 
   QUESTIONNAIRE, 
   BATCHES,
   VALIDATE_DOB,
   NOTIFICATIONS,
   PATIENTS,
   FILES
} from './axios';

import { Batch } from '../state/interfaces';

export const login = async (email : string, password: string) => {
   return axios.post(LOGIN_REQUEST,  {username: email, password})
}

export const getAssessment = async (assessmentId: string) => {
   return axios.get(`${ASSESSMENTS}/${assessmentId}`);
}

export const getAssessmentBatch = async (batchId: string) => {
   const batch = await axios.get(`${BATCHES}/${batchId}`);
   return batch.data;
}

export const updateAssessmentBatch = async (batchId: string, batch: Batch) => {
   return axios.patch(`${BATCHES}/${batchId}`, batch);
}

export const getQuestionnaire = async (questionnaireId: string) => {
   return axios.get(`${QUESTIONNAIRE}/${questionnaireId}`);
}

export const updateAnswers = async (assessmentId: string, answers: number[]) => {
   return axios.patch(`${ASSESSMENTS}/${assessmentId}`, {answers});
}

export const completeAssessment = async (assessmentId: string, score: number) => {
   return axios.patch(`${ASSESSMENTS}/${assessmentId}`, {complete: true, score });
}

export const validateDOB = async (patient : string, DOB: string) => {
   return (await axios.post(VALIDATE_DOB,  {patient, DOB: DOB})).data;
}

export const sendResultsApi = async (method: string, batch: string, patient: string) => {
   return axios.post(`${NOTIFICATIONS}/send-results`, {method, batch, patient});
}

export const getPatient = async (patientId: string) => {
   if (!patientId) {
      return {};
   }
   const patient = await axios.get(`${PATIENTS}/${patientId}`);
   return patient.data;
}

export const postReferalCoordinationRequest = async (method: string, batch: string, patient: string) => {
   let response = await axios.post(`${NOTIFICATIONS}/send-referal`, {method, batch, patient});
   return response.data;
}

export const getLogoByOrganization = async (organization: string) => {
   const res = await axios.get(`${FILES}/logoByOrganization/${organization}`);
   return res;
}