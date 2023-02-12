import {Button, Box, Typography} from '@mui/material';
import welcomeImage from '../../assets/welcome.png';
import styles from './instructions.module.css';
import {StateContext} from '../../App';
import {useContext} from 'react';

interface InstructionProps {
    onStart: Function;
    questions: any[];
}

const buttonStyles = {
    "&.MuiButton-root": {
        margin: '48px',
        backgroundColor: '#DAEFED',
        borderRadius: '1rem',
        width: 440,
        height: 56,
        color: '#183F4F',
        boxShadow: 'none',
    },
};

export const getNoOfQuestions = (questions: any[]) => {
    const len = questions.length;
    if (questions.find(q => q.assessmentTitle === 'PHQ-2')){
        return len + 7;
    }
    return len;
}

export const Instructions = ({
    onStart,
    questions,
}: InstructionProps) => {
    const state = useContext(StateContext);

    return (
        <Box className={styles.instructionsContainer}>
            <img src={welcomeImage} className={styles.mainImg}/>
            <Box sx={{
                marginBottom: '48px'
            }}>
                <p className={styles.title}>Welcome, <b>{state.patient.firstName ? state.patient.firstName : 'Patient'}!</b></p>
                <Typography className={styles.instructions}>
                    Your doctor is requesting a behavioral health assessment.
                </Typography>
            </Box>
            <Typography sx={{
                fontSize: '18px',
                lineHeight: '32px',
                color: '#183F4F',
                whiteSpace: 'pre-line'
            }}>
                The assessment includes up to <b>{questions ? getNoOfQuestions(questions) : 16} questions</b> and will take no longer than 5{'\n'} minutes to complete. Your results will be held secure and private.
            </Typography>
            <Button 
                size='large'
                variant='contained'
                sx={buttonStyles} 
                onClick={(e) => onStart(e)}>Start The Assessment
            </Button>
        </Box>
    )
}