import {Batch, AssessmentQuestion, Patient} from "./interfaces";

/*
** Quesiton index actions
*/

export const setQuestionIndex = (index: number) => {
    return({
        type: 'SET_QUESTION_INDEX',
        slice: 'questionIndex',
        payload: index
    });
};

export const incrementQuestionIndex = () => {
    return({
        type: 'INCREMENT_QUESTION_INDEX',
        slice: 'questionIndex'
    });
};

export const decrementQuestionIndex = () => {
    return({
        type: 'DECREMENT_QUESTION_INDEX',
        slice: 'questionIndex'
    });
}

/*
** Assessment Batch actions
*/

export const setAssessmentBatch = (batch: Batch) => {
    return({
        type: 'SET_ASSESSMENT_BATCH',
        slice: 'assessmentBatch',
        payload: batch
    });
};

/*
** Alert actions
*/

export const setAlertTitle = (title: string) => {
    return({
        type: 'SET_ALERT_TITLE',
        slice: 'alert',
        payload: title
    })
};

export const setAlertText = (text: string) => {
    return({
        type: 'SET_ALERT_MESSAGE',
        slice: 'alert',
        payload: text
    })
};

export const setShowAlertDialog = (show: boolean) => {
    return({
        type: 'SET_SHOW_ALERT',
        slice: 'showAlert',
        payload: show
    })
};

/*
** Question Actions
*/

export const setQuestions = (questions: AssessmentQuestion[]) => {
    return({
        type: 'SET_QUESTIONS',
        slice: 'questions',
        payload: questions
    });
};

/*
** Patient Actions
*/

export const setPatient = (patient: Patient) => {
    return({
        type: 'SET_PATIENT',
        slice: 'patient',
        payload: patient
    });
};

/*
** File Actions
*/

export const setLogo = (file: string) => {
    return({
        type: 'SET_LOGO',
        slice: 'files',
        payload: file
    });
}

/*
** Loading Actions
*/

export const setLoading = (loading: boolean) => {
    return({
        type: 'SET_LOADING',
        slice: 'isLoading',
        payload: loading
    });
}