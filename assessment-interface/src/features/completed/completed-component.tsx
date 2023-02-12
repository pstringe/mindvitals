import styles from '../instructions/instructions.module.css';
import {Button, Box, Typography} from '@mui/material';
import welcomeImage from '../../assets/welcome.png';

export const Completed = () => {
    return (
        <Box sx={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            flexBasis: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px',
        }} className={styles.instructionsContainer}>
            <img src={welcomeImage} className={styles.mainImg}/>
            <Box sx={{
                marginBottom: '48px'
            }}>
                <Typography className={styles.instructions}>
                    The assessment has been completed. You can now close this window.
                </Typography>
            </Box>
        </Box>
    );
};