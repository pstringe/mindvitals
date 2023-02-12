import { 
    Typography, 
    Box,
} from "@mui/material"
import { AssessmentQuestion } from "../../state/interfaces"
import styles from './question.module.css';
import { MultipleChoiceSelection } from '../multiple-choice-selection/multiple-choice-selection-component';
import { AssessmentStats } from "../results/results";

export interface QuestionProps{
    index: number;
    question: AssessmentQuestion;
    handleSelection?: Function;
    length?: number;
    review?: boolean;
    values?: Array<boolean>;

}

export const Question = ({
    index, 
    question, 
    handleSelection,
    length,
    review=false,
    values=[]
}: QuestionProps) => {
    const NormalQuestion = () => {
        return (
            <Box className={styles.question}>
                <Box sx={{margin: '1rem'}}>
                    {length && <AssessmentStats score={index} total={length} />}
                </Box>
                {index >= 0 ? 
                    <Typography gutterBottom variant='h6' className={styles.questionIndex}>
                        QUESTION {index + 1}
                    </Typography> 
                : null}
                
                {!review && 
                <>
                    {index >= 0 ?
                    <p className={styles.instruction}>
                        Over the past 2 weeks, how often have you experienced the following:
                    </p>
                    : null}
                    <p className={styles.prompt}>{question?.prompt}</p>
                    { handleSelection && <MultipleChoiceSelection values={values} index={index} handleSelection={handleSelection} choices={question?.choices} answer={question?.answer}/>}
                </>}
            </Box> 
            
        );
    }

    const ReviewQuestion = () => {
        return (
            <Box className={styles.question}>
                <Typography gutterBottom variant='h6' className={styles.questionIndex}>
                    QUESTION {index + 1}
                </Typography>
                <p className={styles.prompt}>{question?.prompt}</p>
                <p>Answer: {question.choices[question.answer]}</p>
            </Box> 
            
        );
    }
    return (!review ? <NormalQuestion/> : <ReviewQuestion/>);
}