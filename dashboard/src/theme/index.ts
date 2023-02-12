import { createTheme } from '@mui/material/styles'

export * from './createPalette.d'

export const theme = createTheme({
  typography: {
    fontFamily: 'Roberto, sans-serif',
    fontWeightRegular: 450,
    fontWeightMedium: 600,
    fontWeightBold: 750,
    h1: {
      fontSize: 32,
      fontWeight: 600,
    },
    h2: {
      fontSize: 24,
      fontWeight: 600,
    },
    h3: {
      fontSize: 20,
      fontWeight: 600,
    },
    h4: {
      fontSize: 18,
      fontWeight: 600,
    },
    h5: {
      fontSize: 16,
      fontWeight: 600,
    },
    h6: {
      fontSize: 16,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 400,
    },
    body1: {
      fontSize: 12,
      fontWeight: 400,
    },
    caption: {
      fontSize: 10,
      fontWeight: 600,
    },
  },

  palette: {
    primary: {
      main: '#36BCA8',
    },
    secondary: {
      main: '#6D9147',
    },
    disabled: {
      main: '#B4C2C3',
    },
    backgroundGreen: {
      main: '#F8FAF8',
    },
    primaryNavy: {
      main: '#183F4F',
    },
    primaryGreen: {
      main: '#92be71',
    },
    secondaryGreen1: {
      main: '#6D9147',
    },
    secondaryGreen2: {
      main: '#BBDC9C',
    },
    secondaryGreen3: {
      main: '#278C79',
    },
    secondaryMint1: {
      main: '#278c79',
    },
    secondaryMint2: {
      main: '#A3D9CF',
    },
    secondaryNavy1: {
      main: '#456772',
    },
    secondaryNavy2: {
      main: '#7C989B',
    },
    primaryMint: {
      main: '#36BCA8',
    },
    backgroundMint: {
      main: '#DAEFED',
    },
    backgroundGray: {
      main: '#F2F2F2',
    },
    accentRed: {
      main: '#EB5757',
    },
    accentRed1: {
      main: '#E5652E',
    },
    accentRed2: {
      main: '#C93535',
    },
    accentYellow: {
      main: '#E6AF24',
    },
    yellow: {
      main: '#FFF4CB',
    },
    distinctiveGray: {
      main: '#E3E3E3',
    },
    backgroundRed: {
      main: '#FEDEDE',
    },
    backgroundYellow: {
      main: '#FFF6D6',
    },
    backgroundWhite: {
      main: '#FFFFFF',
    },
    contrastThreshold: 3,
  },
})
