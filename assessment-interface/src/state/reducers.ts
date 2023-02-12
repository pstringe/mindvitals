import {State, Action} from "./interfaces";

export const rootReducer = (state: State, action: Action) => {
    switch (action.slice) {
        case "authorization":
            return authorizationReducer(state, action);
        case "assessmentBatch":
            return assessmentBatchReducer(state, action);
        case "questions":
            return questionsReducer(state, action);
        case "questionIndex":
            return questionIndexReducer(state, action);
        case "results":
            return resultsReducer(state, action);
        case "isLoading":
            return isLoadingReducer(state, action);
        case "showNext":
            return showNextReducer(state, action);
        case "agreementValues":
            return agreementValuesReducer(state, action);
        case "dob":
            return dobReducer(state, action);
        case "showAlert":
            return showAlertReducer(state, action);
        case "alert":
            return alertReducer(state, action);
        case "patient":
            return patientReducer(state, action);
        case "files":
            return filesReducer(state, action);
        default:
            return state;
    }
};

const authorizationReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_AUTHORIZATION":
            return {
                ...state,
                authorization: action.payload
            };
        default:
            return state;
    }
}

const assessmentBatchReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_ASSESSMENT_BATCH":
            return {
                ...state,
                assessmentBatch: action.payload
            };
        default:
            return state;
    }
}

const questionsReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_QUESTIONS":
            return {
                ...state,
                questions: action.payload
            };
        default:
            return state;
    }
}

const questionIndexReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_QUESTION_INDEX":
            return {
                ...state,
                questionIndex: action.payload
            };
        case "INCREMENT_QUESTION_INDEX":
            console.log("INCREMENT_QUESTION_INDEX");
            return {
                ...state,
                questionIndex: Math.min(state.questionIndex + 1 , state.questions?.length)
            };
        case "DECREMENT_QUESTION_INDEX":
            return {
                ...state,
                questionIndex: state.questionIndex >= 0 ? Math.max(state.questionIndex - 1, 0) : Math.max(state.questionIndex - 1, -3)
            };

        default:
            return state;
    }
}

const resultsReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_RESULTS":
            return {
                ...state,
                results: action.payload
            };
        default:
            return state;
    }
}

const isLoadingReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
}

const showNextReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_SHOW_NEXT":
            return {
                ...state,
                showNext: action.payload
            };
        default:
            return state;
    }
}

const agreementValuesReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_AGREEMENT_VALUES":
            return {
                ...state,
                agreementValues: action.payload
            };
        default:
            return state;
    }
}

const dobReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_DOB":
            return {
                ...state,
                dob: action.payload
            };
        default:
            return state;
    }
};

const showAlertReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_SHOW_ALERT":
            return {
                ...state,
                showAlert: action.payload
            };
        default:
            return state;
    }
};

const alertReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_ALERT":
            return {
                ...state,
                alert: action.payload
            };
        case "SET_ALERT_TITLE":
            return {
                ...state,
                alert: {
                    ...state.alert,
                    title: action.payload
                }
            };
        case "SET_ALERT_MESSAGE":
            return {
                ...state,
                alert: {
                    ...state.alert,
                    message: action.payload
                }
            };
        default:
            return state;
    }
};

const patientReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_PATIENT":
            return {
                ...state,
                patient: action.payload
            };
        default:
            return state;
    }
}

const filesReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "SET_LOGO":
            return {
                ...state,
                logo: action.payload
            };
        default:
            return state;
    }
}