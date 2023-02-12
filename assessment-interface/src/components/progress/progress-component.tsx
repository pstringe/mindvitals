import {Box, CircularProgress} from '@mui/material';
import styles from './progress.module.css';

export const Progress = ({height='80vh'}) => {
    return (
        <div className={styles.progress} style={{height}}>
            <CircularProgress color='success'/>
        </div>
    );
}