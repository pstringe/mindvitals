import './App.css';
import { Outlet } from 'react-router';
import { Container, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import mindvitalsLogo from './assets/logo-dark.png';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { rootReducer } from './state/reducers';
import { initialState } from './state/state'; 
import { State } from './state/interfaces';
import React from 'react';
import { Header } from './components/header/header-component';

const theme = createTheme({});
export const StateContext = React.createContext<State>({} as State);
export const DispatchContext = React.createContext<any>(null);

function App() {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={DateAdapter}>
          <div className="App">
            <Header/>
            <Container maxWidth='md'>
              <Outlet/>
            </Container>
            <footer>
              <Box className='mindvitalsLogoContainer'>
                  <b>POWERED BY</b><img src={mindvitalsLogo} alt='mindvitals logo'/>
              </Box>
            </footer>
          </div>
          </LocalizationProvider>
        </ThemeProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
