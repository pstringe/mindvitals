import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { } from '@mui/styles'



export default function CenterLoader() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      background: `rgba(255, 255, 255, .5)`,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 30,
    }}>
      <CircularProgress sx={{
        alignSelf: 'center',
        justifySelf: 'center',
      }}/>
    </Box>
  )
}
