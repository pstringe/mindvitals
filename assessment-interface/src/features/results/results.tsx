import { LinearProgress, Typography, Card, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Assessment } from "../../state/interfaces";
import styles from './results.module.css';
import thankyouImg from '../../assets/thankyou.png';
import { StateContext } from "../../App";
import { DispatchContext } from "../../App";
import { useContext, useState, useEffect } from "react";
import { postReferalCoordinationRequest } from "../../api/api";
import {
    setAlertTitle,
    setAlertText,
    setShowAlertDialog,
} from "../../state/actions";
import {Progress} from '../../components/progress/progress-component';

interface AssessmentStatsProps {
    score: number;
    total: number;
}

interface ResultProps {
    assessments: Assessment[];
    sendResults: Function;
}

const buttonStyles = {
    height: '46px',
    borderRadius: '8px',
    padding:'12px 16px 13px 16px',
};

const shareButtonStyles = {
    "&.MuiButton-root": {
        ...buttonStyles,
        width: '167px',
        border: '1px solid #6D9147'
    },
    "&.MuiButton-text": {
      color: "#6D9147"
    },
};

const submitButtonStyles = {
    "&.MuiButton-root": {
        ...buttonStyles,
       backgroundColor: '#6D9147'
    },
    "&.MuiButton-text": {
      color: "white"
    },
};

export const AssessmentStats = ({score, total}: AssessmentStatsProps) => {
    return (
        <LinearProgress color='success' variant='determinate' value={(score / total) * 100}/>
    );
}

export const Results = ({assessments, sendResults}: ResultProps) => {
    const [preparingResults, setPreparingResults] = useState(true); 
    const [results, setResults] = useState([] as JSX.Element[]);
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const submitReferalCoordinationRequest = async () => {
        const response = await postReferalCoordinationRequest(
            'email', 
            state.assessmentBatch._id, 
            state.assessmentBatch.patient
        );
        dispatch(setAlertTitle("Referal coordination request has been submitted"));
        dispatch(setAlertText(`The clinic's dedicated referral coordinator will be reaching out via text within 1 businness day.`));
        dispatch(setShowAlertDialog(true));
    }

    const prepareResults = () => {
        setPreparingResults(true);
        const resultsArray = assessments.map((assessment: Assessment, idx: number) => {
            return (
                <Box sx={{marginBottom: '1.5rem'}} key={`${idx}${assessment._id}`}>
                    <p className={styles.title}><b>{assessment.resultHeading}</b> ({assessment.type})</p>
                    <AssessmentStats score={assessment.score} total={assessment.answers.length * 3} />
                    <Typography sx={{
                        marginTop: '24px',
                    }} gutterBottom variant='h6'>
                        Your responses are consistent with {assessment.severity} {assessment.resultHeading?.toLocaleLowerCase()}. (Score: {assessment.score}/{assessment.answers.length * 3})
                    </Typography>
                </Box>
            )
        })
        setResults(resultsArray);
        setPreparingResults(false);
    }

    useEffect(() => {
        prepareResults();
    }, []);

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <img src={thankyouImg} className={styles.mainImg}/>
                <Box sx={{
                    marginBottom: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <p className={styles.thankyouTitle}>Thank you, <b>{state.patient.firstName ? state.patient.firstName : 'Patient'}!</b></p>
                    <Typography className={styles.instructions}>
                    Your assessment has been completed and your results were successfully shared with your doctor.                    </Typography>
                </Box>
            </Box>
            {!preparingResults ? results : <Progress height={`${120 * assessments?.length}px`}/>}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
            }}>
            <Card 
                sx={{
                    boxShadow: 'none',
                    borderRadius: '8px'
                }}
                className={styles.card}
            >
                <h5  className={styles.cardHeader}> Share a copy of the result</h5>
                <p>A copy of the results above will be shared via text for future reference.</p>
                <Box sx={{
                    display: 'flex',
                    gap: '1rem'
                }}>
                    <Button onClick={() => sendResults('sms')} sx={shareButtonStyles}>Share Via Text</Button>
                    <Button onClick={() => sendResults('email')} sx={shareButtonStyles}>Share Via Email</Button>
                </Box>
                

            </Card>
            <Card sx={{
                boxShadow: 'none',
                borderRadius: '8px'
            }} className={styles.card}>
                <h5 className={styles.cardHeader}> Submit referral coordination request</h5>
                <p>A dedicated referral coordinator will be reaching out via text to help find the right mental healthcard provider.</p>
                <Button onClick={() => {
                    submitReferalCoordinationRequest();
                }} sx={submitButtonStyles}>Submit</Button>
            </Card>
            </Box>
        </Box>
    );
}