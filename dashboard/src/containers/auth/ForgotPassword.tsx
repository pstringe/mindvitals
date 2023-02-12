import { Box, Button, Card, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import { Header } from 'components/Header'
import { useSnackbar } from 'notistack'
import { useForgotPassword } from 'api/authApi'

interface Props {}

export const ForgotPassword: React.FC<Props> = () => {
  const forgotPassword = useForgotPassword();
  const { logIn } = useAuth()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackbar = useSnackbar();
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'| 'warning'| 'info'>('info');
  const navigate = useNavigate()

  const validEmail = (email: string) => {
    if (email.length < 1) {
      setEmailHelperText('Email is required')
      return false
    }
    return true
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (!validEmail(email)) {
      return
    }
    forgotPassword(email);
    enqueueSnackbar('Check your email to reset your password', { variant: 'info' });
  }

  return (
    <>
    <Header/>
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '70vh',
        justifyContent: 'flex-start',
        marginTop: '68px',
        textAlign: 'center',
      }}>
        <Typography  variant='h2' sx={{
          marginBottom: '39px',
          color: 'primaryNavy.main',
          fontWeight: 'normal',
        }}>
          Forgot Password
        </Typography>
        <Card sx={{
          width: '448px',
          height: 'auto',
          borderRadius: '8px',
          padding: '24px',
        }}>
          <form onSubmit={onSubmit}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
            <TextField
              fullWidth
              onChange={(e: any) => setEmail(e?.target?.value)}
              id="email"
              label="email"
              variant="outlined"
              type="email"
              error={emailError}
              helperText={emailHelperText}
            />
            <div>
              <Button fullWidth type="submit" variant="contained" color='secondary' >
                Reset Password
              </Button>
            </div>
            </Box>
          </form>
        </Card>
      </Container>
    </>
  )
}
