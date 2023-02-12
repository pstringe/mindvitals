import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { QueryClient, QueryClientProvider } from 'react-query'
import { theme } from './theme/index'
import { AuthProvider } from './hooks/useAuth'
import { ViewportProvider } from './hooks/useViewport'
import App from './app/App'
import * as serviceWorker from './serviceWorker'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          style={{ zIndex: 99999999999999999 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          maxSnack={5}
        >
          <ViewportProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <App />
              </AuthProvider>
            </QueryClientProvider>
          </ViewportProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
