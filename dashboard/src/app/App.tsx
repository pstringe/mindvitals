import useAuth from 'hooks/useAuth'
import CenterLoader from 'components/common/CenterLoader'
import { PublicApp } from 'app/PublicApp'
import { Box } from '@mui/material'
import { AuthenticatedApp } from './AuthenticatedApp'
import { useEffect } from 'react'

function App() {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const { isAuthenticated, isLoading, checkExpired } = useAuth()
  
  useEffect(() => {
    if (!isLoading){
      checkExpired()
    }
    if (isAuthenticated) {
      setInterval(() => {
        checkExpired();
      }, FIVE_MINUTES);
    }
  }, [isAuthenticated, isLoading])
  
  if (window.location.protocol == 'http:' && window.location.hostname != 'localhost') {
    console.log("you are accessing us via "
        +  "an insecure protocol (HTTP). "
        + "Redirecting you to HTTPS.");
    window.location.href =
        window.location.href.replace(
                   'http:', 'https:');
}
  if (isLoading) {
    return (<Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
    }}>
      <CenterLoader />
    </Box>);
  }

  return <>{isAuthenticated ? <AuthenticatedApp /> : <PublicApp />}</>
}

export default App
