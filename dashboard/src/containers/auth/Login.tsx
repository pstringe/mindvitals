import { Box, Button, Card, Container, TextField, Typography, Link } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import { Header } from 'components/Header'
import { useSnackbar } from 'notistack'

interface Props {}

export const Login: React.FC<Props> = () => {
  const { logIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passError, setPassError] = useState(false)
  const [passHelperText, setPassHelperText] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();

  const validPassword = (password: string) => {
    if (password.length < 8) {
      setPassHelperText('Password must be at least 8 characters')
      return false
    }
    return true
  }

  const validEmail = (email: string) => {
    if (email.length < 1) {
      setEmailHelperText('Email is required')
      return false
    }
    return true
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const isValidPassword = validPassword(password);
    const isValidEmail = validEmail(email);
    if (!isValidPassword) {
      setPassError(true)
    }
    if (!isValidEmail) {
      setEmailError(true)
    }
    if (!(isValidPassword && isValidEmail)) {
      return
    }
    const result = await logIn(email, password)
    if (result?.loggedIn) {
      navigate('/')
    } else {
      enqueueSnackbar('Invalid email or password', { variant: 'error' })
    }
    return result
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
          Sign In
        </Typography>
        <Card sx={{
          width: '448px',
          height: '239px',
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
              error={emailError}
              helperText={emailHelperText}
            />
            <TextField
              fullWidth
              onChange={(e: any) => setPassword(e?.target?.value)}
              id="password"
              label="password"
              variant="outlined"
              type="password"
              error={passError}
              helperText={passHelperText}
            />
            <div>
              <Button fullWidth type="submit" variant="contained" color='secondary' >
                Sign In
              </Button>
            </div>
            <Link href='forgot-password' >Forgot Password</Link>
            </Box>
          </form>
         
        </Card>
      </Container>
    </>
  )
}
