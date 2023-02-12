import Axios from 'axios';
import { API_URL } from '../config/config';

/*
** API endpoints
*/

export const LOGIN_REQUEST = '/auth/login';
export const ASSESSMENTS = '/assessments';
export const QUESTIONNAIRE = '/questionnaires';
export const BATCHES = '/batches';
export const NOTIFICATIONS = '/notifications';
export const VALIDATE_DOB = './validation/patient/dob';
export const PATIENTS = '/patients';
export const FILES = '/files';

export const axios = Axios.create({
    baseURL: API_URL,
    withCredentials: true
});