import { Box, TextField, Button } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { sendResults } from './send-results-api';
import { useParams } from 'react-router-dom';
import { Assessment } from "../../state/interfaces";

interface SendResultsProps {
    assessment: Assessment;
}

export const SendResults = ({assessment}: SendResultsProps) => {
    const [phoneNo, setPhoneNo] = useState('');
    const params = useParams();
    const handleChange = (e: SyntheticEvent) => {
        e.preventDefault();
        setPhoneNo((e.target as HTMLInputElement).value);
    };
   
    const handleNumberSubmit = () => {
        const patientId = assessment.patientId;
        sendResults('+1' + phoneNo, params?.batch ? params.batch : '', patientId ? patientId : '');
    }

    return (
        <Box>
            <TextField value={phoneNo} onChange={(e) => handleChange(e)} variant="outlined" />
            <Button onClick={handleNumberSubmit} variant='contained'>Get results</Button>
        </Box>
    );
}