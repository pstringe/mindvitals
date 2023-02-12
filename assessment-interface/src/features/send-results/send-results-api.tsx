import { axios, NOTIFICATIONS } from '../../api/axios';

export const sendResults = async (destination: string, batchId: string, patientId: string) => {
    console.log('patch')
    return axios.post(`${NOTIFICATIONS}/send-results`, {destination, batchId, patientId});
}