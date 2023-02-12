import { 
    alertInterface,
    Assessment,
    AssessmentQuestion, 
    Batch, 
    State,
    Patient,
} from "./interfaces";

export const initialState: State = {
    logo: "",
    authorization: {},
    assessmentBatch: {} as Batch,
    questions: [] as AssessmentQuestion[],
    questionIndex: -3 as number,
    results: [] as Assessment[],
    isLoading: false as boolean,
    showNext: false as boolean,
    agreementValues: [false, false, false] as boolean[],
    dob: new Date() as Date,
    showAlert: false as boolean,
    patient: {} as Patient,
    alert: {
        message: "",
        title: ""
    } as alertInterface,
}