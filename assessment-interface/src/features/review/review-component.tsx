import { Batch, Assessment, AssessmentQuestion } from "../../state/interfaces";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import thankyouImg from "../../assets/thankyou.png";
import styles from "./review.module.css";
import { useContext, useEffect } from "react";
import { StateContext } from "../../App";
import { AssessmentStats } from "../results/results";

interface ReviewProps {
    batch: Batch;
}

export interface ResultsTableProps {
    questions: AssessmentQuestion[];    
}

export const ResultsTable = ({questions}: ResultsTableProps) => {
    
    return (
        <div className={styles.resultsTable}>
            <table>
                {questions.map((question, index) => {
                    return (
                        <tr key={index}>
                            <td>{question.prompt}</td>
                            <td>{(question.choices.find((choice) => choice.pointValue === question.answer)).choice}</td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}

export const Review = ({batch}: ReviewProps) => {
    const state = useContext(StateContext);

    const getQuestions = (batch: Batch, assessment: Assessment) => {
        const assessmentId = assessment._id;
        const questions = batch.questions.filter(q => q.assessmentId === assessmentId);
        return questions;
    }

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
                    <p className={styles.thankyouTitle}><b>Your Results</b></p>
                    <Typography className={styles.instructions}>
                    Name: {state.patient.firstName} {state.patient.lastName} {'\n'}
                    Assessment completed: {(new Date(batch?.modifyDate)).toLocaleDateString()}
                    </Typography>
                    <Typography className={styles.instructions}>
                                     
                    </Typography>
                </Box>
            </Box>
            {batch?.assessments?.map((assessment: Assessment, idx: number) => {
                return (
                    <Box sx={{marginBottom: '1.5rem'}} key={`${idx}${assessment._id}`}>
                        <p className={styles.title}><b>{assessment.resultHeading}</b> ({assessment.type})</p>
                        <AssessmentStats score={assessment.score} total={assessment.answers.length * 3} />
                        <Typography sx={{
                            marginTop: '24px',
                        }} gutterBottom variant='h6'>
                            Your responses are consistent with {assessment.severity} {assessment.resultHeading?.toLocaleLowerCase()}. (Score: {assessment.score}/{assessment.answers.length * 3})
                        </Typography>
                        <Accordion>
                            <AccordionSummary>
                                <p><b>View all responses for {assessment.type}</b></p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ResultsTable questions={getQuestions(batch, assessment)} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>  
                )
            })}
        </Box>
    );
}