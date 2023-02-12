import { IAssessment, IQuestion, IScreener, IScreenResult, IScreenResultAnswer } from 'types'
import { useApiFetch } from './useApiFetch'
import {useGetPatientById} from '../api/patientsApi'
import { GridFilterModel } from '@mui/x-data-grid'

const shapeDetails = (assessment: IAssessment, questions: IQuestion[]) => {
    const details = questions.filter(
      (question: IQuestion) => question.assessmentId === assessment._id,
    )
    return details.map((question: IQuestion) => ({
      question: question.prompt,
      answer: question.choices[question.answer]?.choice,
    }))
  }

const shapeAnswers = (
    assessments: IAssessment[],
    questions: IQuestion[],
    ): IScreenResultAnswer[] => {
    const answers = assessments.map(assessment => {
        return {
        type: assessment.type,
        isHighRisk: assessment.severity === 'severe' ? true : false,
        score: assessment.score,
        details: shapeDetails(assessment, questions),
        }
    })
    return answers
}

const shapePatientResults =  (screeners: IScreener[]): IScreenResult[] => {
    const results = screeners.map((screener, idx) => {
        let row: IScreenResult = {
            id: screener._id,
            patientId: screener.patient,
            createdAt: screener.createDate,
            answers: shapeAnswers(screener.assessments, screener.questions),
            status: screener.completed ? 'Completed' : 'Incomplete',
            source: screener.requestMethod ? screener.requestMethod : 'system',
        }
      return row
    });
    return results
}

  const shapeProviderResults =  (screeners: IScreener[]): IScreenResult[] => {
    const results = screeners.map((screener, idx) => {
        let row: IScreenResult = {
            id: screener._id,
            name: screener.patientFirstName + ' ' + screener.patientLastName,
            patientId: screener.patient,
            createdAt: screener.createDate,
            answers: shapeAnswers(screener.assessments, screener.questions),
            status: screener.completed ? 'Completed' : 'Incomplete',
            source: screener.requestMethod ? screener.requestMethod : 'system',
        }
      return row
    });
    return results
}

export const useGetScreenersByPatientId = () => {
  const apiFetch = useApiFetch()

  return async (patientId: string) => {
    const { data } = await apiFetch(`/batches/patient/${patientId}`, {
      method: 'GET',
    })
    return shapePatientResults(data);
  }
}

export const useGetScreenersByProviderId = () => {
    const apiFetch = useApiFetch()

    return async (providerId: string, pageNo: number, pageSize: number, filterModel?: GridFilterModel) => {     
        const filterParams = filterModel ? `&filter=${JSON.stringify(filterModel)}` : ''   
        const { data } = await apiFetch(`/batches/provider/${providerId}?skip=${pageNo * pageSize}&limit=${pageSize}` + filterParams, {
            method: 'GET',
        })
        return {screeners: shapeProviderResults(data.screeners), count: data.count};
    }
}

export const useGetScreenerOptions = () => {
    const apiFetch = useApiFetch()
    
    return async () => {
        const { data } = await apiFetch(`batches/screener-options`, {
        method: 'GET',
        })
        return data
    }
}

export const useSendResults = () => {
    const apiFetch = useApiFetch()

    return async (screener: IScreenResult, method: 'sms' | 'email') => {
        const notification = {
            method,
            patient: screener.patientId,
            batch: screener.id,
        };

        const { data } = await apiFetch(`notifications/send-results`, {
            method: 'POST',
            data: notification
        })
        return data
    }
}

export const useRequestScreener = (
  method: 'sms' | 'email' | 'qr' | 'copy',
  personnelId: string,
) => {
    const apiFetch = useApiFetch()
    const getScreenerOptions = useGetScreenerOptions();

    return async (
        request: string,
        patientId: string,
        ) => {
        const screeners = await getScreenerOptions();

        /*
        ** construct payload
        */

        const assessments = request.split(',').map(assessment => {
            return screeners.find((screener: { value: string }) => screener.value === assessment)?.payload
        }).reduce((acc, curr) => {
            return acc.concat(curr);
        }, []);

        const payload = {
            assessments,
            patient: patientId,
            personnel: personnelId,
            requestMethod: method,
        }

        /*
        ** create screener
        */

        const { data } = await apiFetch(`/batches/`, {
            method: 'POST',
            data: payload,
        })

        /*
        ** send notification to patient requesting them to complete screener
        */

        const notification = {
            method,
            patient: patientId,
            batch: data._id,
        }

        const res =
        method !== 'qr' && method !== 'copy'
            ? await apiFetch(`/notifications/send-screener-request`, {
                method: 'POST',
                data: notification,
            })
            : undefined

        return { screener: data, notification: res?.data }
    }
}
