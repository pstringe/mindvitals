import { useCallback, useContext, useEffect, useState } from 'react';
import { Question } from '../question/question-component';
import { useParams } from "react-router-dom";
import { Controls } from '../controls/controls-component'
import { Progress } from '../../components/progress/progress-component';
import { Instructions } from '../instructions/instructions-component'
import { AssessmentStats, Results } from '../results/results';
import { Review } from '../review/review-component';
import { Agreement } from '../agreement/agreement-component';
import { DobConfiramtion } from '../dob-confirmation/dob-confirmation';
import { Batch, Assessment as AssessmentInterface } from '../../state/interfaces';
import { StateContext } from "../../App";
import { DispatchContext } from "../../App";
import { useNavigate } from "react-router-dom";
import styles from './assessment.module.css';
import { 
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button 
} from '@mui/material';
import { 
    getAssessmentBatch, 
    login, 
    updateAssessmentBatch,
    sendResultsApi,
    getPatient,
    getLogoByOrganization,
} from '../../api/api';
import { 
    setQuestionIndex,
    incrementQuestionIndex,
    setAssessmentBatch,
    setAlertText,
    setAlertTitle,
    setShowAlertDialog,
    setQuestions,
    setPatient,
    setLogo,
    setLoading   
 } from '../../state/actions';


interface AssessmentProps {
    review: boolean;
}

export const Assessment = ({review}: AssessmentProps) => {
    const params = useParams();
    const batchId = params.batch as string;
    const [authorization, setAuthorization] = useState({});
    const [results, setResults] = useState([] as AssessmentInterface[]);
    const [showNext, setShowNext] = useState(false);
    const [agreementValues, setAgreementValues] = useState([false, false, false, false]);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const navigate = useNavigate();

    /*
    ** event handlers
    */

    const onStartAssessment = (e: Event) => {
        e.preventDefault();
        dispatch(setQuestionIndex(-2));
    }

    const conditionallyTerminate = async (oldBatch: Batch) => {
        const oldQuestion = oldBatch.questions[state.questionIndex];
        const terminating = oldQuestion.terminating;
        if (!terminating) {
            return false;
        }
      
        const batch = (await updateAssessmentBatch(batchId, oldBatch)).data;
        dispatch(setAssessmentBatch(batch));
        return false;
    }

    const handleSelection = async (e: Event, index: number, points: number) => {
        const batch = {...state.assessmentBatch}
        const questions = state.assessmentBatch.questions.map((q) => ({ ...q }));
        const newQuestion = questions[index];
        newQuestion.answer = points;
        questions.splice(index, 1, newQuestion);
        batch.questions = questions;
        await dispatch(setAssessmentBatch(batch));
        if (newQuestion.terminating && newQuestion.assessmentTitle === 'PHQ-2') {
            setLoading(true);
            await conditionallyTerminate(batch)
            setLoading(false);
        }
        dispatch(incrementQuestionIndex());
    }  

    const sendResults = async (method: string) => {
        const response = (await sendResultsApi(method, state.assessmentBatch._id, state.assessmentBatch.patient)).data;
        dispatch(setAlertTitle("Results have been shared"));
        dispatch(setAlertText(`We've sent a copy of the results to: ${response.destination}`));
        dispatch(setShowAlertDialog(true));
    }

    const updateAgreement = (index: number) => {
        const newVals = [...agreementValues];
        const oldVal = agreementValues[index];
        newVals.splice(index, 1, !oldVal)
        setAgreementValues(newVals);
        const show = newVals.reduce((acc, cur) => !acc ? false : cur);
        setShowNext(show);
    }

    const submit = async () => {
        await updateAssessmentBatch(batchId, {
            ...state.assessmentBatch,
            completed: true,
        });
        navigate(`/completed`);
    }
   
    /*
    ** API methods
    */

    const getAssesmentBatch: Function = useCallback(async () => {
        if (!(Object.keys(authorization).length)){
            return {};
        }
        const batchData = await getAssessmentBatch(batchId);
        /*
        if (batchData?.completed) {
            navigate(`/completed`);
        }
        */
        return batchData;
    }, [authorization, batchId, navigate]);

    const authorizeAnonymousUser: Function = useCallback(async () => {
        const anonymouseUser = await login(batchId, batchId);
        setAuthorization(anonymouseUser);
        return anonymouseUser;
    }, [batchId]);

    /*
    ** Authorize temp user with API
    */

    useEffect(() => {
        (async () => {
            const auth = await authorizeAnonymousUser();
            const res = await getLogoByOrganization(auth?.data?.user?.organization);
            setAuthorization(auth.data);
            const src = res?.request?.responseURL;
            dispatch(setLogo(src));
        })();
    }, [authorizeAnonymousUser, dispatch]);

    /*
    ** retrieve assessment batch data
    */

    
    useEffect(() => {
        (async () => {
            const batchData = await getAssesmentBatch(batchId);
            dispatch(setAssessmentBatch(batchData));
        })();
    }, [
        authorization,
        batchId,
        dispatch,
        getAssesmentBatch,
    ]);

    /*
    ** determine if the screener needs to be rescored, 
    ** (either at the end or when a conditional assessment terminates)
    */

    useEffect(() => {
        (async () => {
            const lastQuestion = state.questionIndex >= state.assessmentBatch?.questions?.length;
            if (lastQuestion){
                const completed = state.assessmentBatch.questions.every(question => question.answer !== -1);
                const batch = await updateAssessmentBatch(batchId, {...state.assessmentBatch, completed});
                const assessments = batch.data.assessments;
                setResults(assessments);
            }
        })();
    }, [state.questionIndex]);

    /*
    ** update the questions when a new or updated screener is retrieved
    */

    useEffect(() => {
        (async () => {
            if (!state.patient || Object.keys(state.patient).length == 0){
                const patient = await getPatient(state.assessmentBatch?.patient);
                dispatch(setPatient(patient));
            }
            dispatch(setQuestions(state.assessmentBatch?.questions));
        })();
    }, [state.assessmentBatch]);

    /*
    ** Alert dialog to show if DOB doesn't match
    */

    const AlertDialog = () => {
        return (
        <Dialog
            open={state.showAlert}
            onClose={() => dispatch(setShowAlertDialog(false))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {state.alert.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {state.alert.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => dispatch(setShowAlertDialog(false))}>CLOSE</Button>
            </DialogActions>
        </Dialog>
        );
    }

    /*
    ** Display agreement, then dob confirmation, then questions as the index increments
    */

    const InteractiveContent = () => {
        const choiceStyle = {
            color: '#6D9147'
        }

        if (state.questionIndex === -2) {
            return (
                <Agreement
                    index={state.questionIndex} 
                    handleSelection={updateAgreement}
                    question={{
                        answer: -1,
                        assessmentId: "",
                        assessmentIndex: 0,
                        assessmentTitle: "",
                        batchIndex: -1,
                        prompt: "Let's get some things out of the way before we get started!",
                        choices: [
                            "I understand that my doctor will only be able to review the results of my assessment during business hours.",
                            "I understand that this is not a tool intended for use in emergency medical conditions, and that I should visit the local emergency room or call 911 in such cases.",
                            "I understand that contact information I've provided to my health provider may be used to send me the results of my assessment.",
                            <p >I agree to the <b style={choiceStyle}>Terms of Service</b> and the <b style={choiceStyle}>Privacy Policy</b></p>
                        ],
                        terminating:false
                    }}
                    values={agreementValues}
                />
            );
        }
        if (state.questionIndex === -1 ){
            return (<>
                <DobConfiramtion />
            </>)
        } 
        return (<Question index={state.questionIndex} 
            handleSelection={handleSelection}
            question={state.questions[state.questionIndex]}
            length={state.questions?.length}
        />)
    }

    const TakeAssessment = () => {
        return (
            !state.isLoading ?
            <Container className={styles.assessmentContainer}>
                {state.questionIndex === -3 ?
                    <Instructions questions={state.questions} onStart={onStartAssessment}/> : 
                    state.assessmentBatch?.questions && state.questions && 
                    <div className={styles.assessmentBox}>
                        {
                        state.questionIndex < state.questions?.length ?
                        <>
                            {(state.questionIndex >= 0 && state.questionIndex < state.questions.length) && 
                            <AssessmentStats score={state.questionIndex} total={state.questions.length}/>}
                            <InteractiveContent />
                        </> 
                        :
                        state.questionIndex >= state.questions?.length && 
                        <Results assessments={results} sendResults={sendResults}/>
                        }  
                        <Controls submit={submit} questions={state.questions} enabled={showNext}/>
                    </div>
                } 
            <AlertDialog/>
            </Container> 
            :
            <Progress />
        );
    }
    
    return (!review ? <TakeAssessment/> : <Review batch={state.assessmentBatch}/>)
    
}
