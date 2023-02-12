import { Button, Box } from "@mui/material";
import { useContext } from "react";
import { AssessmentQuestion } from "../../state/interfaces";
import styles from './controls.module.css'
import { StateContext } from "../../App";
import { DispatchContext } from "../../App";
import { validateDOB } from "../../api/api";


export interface ControlProps {
    submit: Function;
    questions: AssessmentQuestion[]; 
    enabled: boolean;
}

const buttonStyles = {
    width: '432px',
    height: '56px',
    borderRadius: '16px'
};

const nextButtonStyles = {
    "&.MuiButton-root": {
        ...buttonStyles,
        backgroundColor: '#DAEFED',
    },
    "&.MuiButton-text": {
      color: "#183F4F"
    },
};

const disabledButtonStyles = {
    "&.MuiButton-root": {
        ...buttonStyles,
        backgroundColor: '#E3E3E3',
    },
    "&.MuiButton-text": {
      color: "#183F4F"
    },
};
const backButtonStyles = {
    "&.MuiButton-root": {
       ...buttonStyles
    },
    "&.MuiButton-text": {
      color: "#7C989B"
    },
};

const closeButtonStyles = {
    "&.MuiButton-root": {
        ...buttonStyles,
    },
    "&.MuiButton-text": {
        color: '#EB5757'
    },
};

export const Controls = ({
    submit,
    questions,
    enabled,
 }: ControlProps) => {
        const state = useContext(StateContext);
        const dispatch = useContext(DispatchContext);
        
        const handleNext = async () => {
            if (state.questionIndex != -1){
                incrementQuestionIndex();
                return ;
            }
            const DOBMatch = await validateDOB(state.assessmentBatch.patient, state.dob.toDateString());
            if (DOBMatch.match) {
                incrementQuestionIndex();
            } else {
                setAlertTitle("Date of birth does not match the patient's record");
                setAlertText("Please enter the correct date of birth");
                setShowAlertDialog(true);
            }   
        }

        const handleDecrement = () => {
            dispatch({
                type: 'DECREMENT_QUESTION_INDEX',
                slice: 'questionIndex'
            });
        }

        const incrementQuestionIndex = () => {
            dispatch({
                type: 'INCREMENT_QUESTION_INDEX',
                slice: 'questionIndex'
            });
        }
        
        const setAlertTitle = (title: string) => {
            dispatch({
                type: 'SET_ALERT_TITLE',
                slice: 'alert',
                payload: title
            })
        }

        const setAlertText = (text: string) => {
            dispatch({
                type: 'SET_ALERT_MESSAGE',
                slice: 'alert',
                payload: text
            })
        }

        const setShowAlertDialog = (show: boolean) => {
            dispatch({
                type: 'SET_SHOW_ALERT',
                slice: 'showAlert',
                payload: show
            })
        }


        return (
        <Box className={styles.controls}>
            {enabled && (state.questionIndex < 0) ?
            <Button
                sx={nextButtonStyles} 
                fullWidth 
                onClick={(e) => handleNext()}>
                    Next
            </Button>
            : 
            (state.questionIndex < 0 && <Button
                    sx={disabledButtonStyles} 
                    fullWidth 
                    >
                        Next
            </Button>)
            }
            {
                state.questionIndex !== questions?.length && 
                <Button
                    sx={backButtonStyles} 
                    fullWidth 
                    onClick={(e) => handleDecrement()}>
                    Back
                </Button>
            }
               
            {( state.questionIndex == state.questions?.length ? ( 
                <Button sx={closeButtonStyles} fullWidth onClick={(e) => submit()}>Close Assessment</Button>
            ): null)}
        </Box>
        );
 }