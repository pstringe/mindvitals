import { Box, Button, Card, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from 'hooks/useAuth'
import { Header } from 'components/Header'
import { useResetPassword } from 'api/authApi'

interface Props {}

export const ResetPassword: React.FC<Props> = () => {
  const { logIn } = useAuth()
  const params = useParams()
  const resetPassword = useResetPassword()
  const [password, setPassword] = useState('')
  const [match, setMatch] = useState('')
  const [passError, setPassError] = useState(false)
  const [passHelperText, setPassHelperText] = useState('')
  const [matchError, setMatchError] = useState(false)
  const [matchHelperText, setMatchHelperText] = useState('')
  
  const navigate = useNavigate()

  const validPassword = (password: string) => {
    if (password.length < 8) {
      setPassHelperText('Password must be at least 8 characters')
      return false
    }
    return true
  }

  const validMatch = (match: string) => {
    if (match !== password) {
      setMatchHelperText('Passwords do not match');
      return false
    }
    return true
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const isValidPassword = validPassword(password);
    const isValidMatch = validMatch(match);
    if (!validPassword(password)) {
      setPassError(true)
    }
    if (!validPassword(password)) {
      setMatchError(true)
    }
    if (!(isValidPassword && isValidMatch)) {
      return
    }
    await resetPassword(params?.email || '', params?.token || '', password);
    navigate('/login');
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
              onChange={(e: any) => setPassword(e?.target?.value)}
              id="password"
              label="password"
              variant="outlined"
              type="password"
              error={passError}
              helperText={passHelperText}
            />
            <TextField
              fullWidth
              onChange={(e: any) => setMatch(e?.target?.value)}
              id="match"
              label="match"
              variant="outlined"
              type="password"
              error={matchError}
              helperText={matchHelperText}
            />
            <div>
              <Button fullWidth type="submit" variant="contained" color='secondary' >
                Change Password
              </Button>
            </div>
            </Box>
          </form>
        </Card>
      </Container>
    </>
  )
}
