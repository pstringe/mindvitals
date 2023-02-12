import { Box } from "@mui/material";
import {useState, useContext} from 'react';
import {StateContext} from '../../App';
import {DispatchContext} from '../../App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';

export const DobConfiramtion = () => {
    const state = useContext(StateContext);;
    const dispatch = useContext(DispatchContext);
    const [dob, setDob] = useState<Date | null>(state.dob);


    const updateDob = (dob: Date | null) => {
        dispatch({
            type: 'SET_DOB',
            slice: 'dob',
            payload: dob
        });
    }

    const isValidDate = (date: Date | null) => {
        if (date === null || date === undefined || isNaN(date.getTime())) {
            return false;
        } else {
            return true;
        }
    }

    const handleDateChange = (date: Date | null, value: string | undefined ) => {
        setDob(date);
        const valid = isValidDate(date) && value !== undefined && value.length === 10
        if (valid) {
            updateDob(date);
        }
    }

    const handleDateAccept = (date: Date | null) => {
        console.log(date);
        setDob(date);
        updateDob(date);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1rem'
        }}>
            <p>To verify your identity, please enter your date of birth</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Date of Birth"
                    value={dob}
                    onChange={handleDateChange}
                    onAccept={handleDateAccept}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

        </Box>
    )
}