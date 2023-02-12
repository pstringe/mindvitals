export interface Theme {
  shape: Shape
  breakpoints: Breakpoints
  direction: Direction
  mixins: Mixins
  overrides?: Overrides
  palette: PaletteOptions
  props?: ComponentsProps
  shadows: Shadows
  spacing: Spacing
  transitions: Transitions
  typography: Typography
  zIndex: ZIndex
  borders: any
}

declare module '@mui/material/styles' {
  interface PaletteOptions {
    disabled: PaletteColorOptions
    backgroundGreen: PaletteColorOptions
    primaryNavy: PaletteColorOptions
    primaryGreen: PaletteColorOptions
    secondaryGreen1: PaletteColorOptions
    secondaryGreen2: PaletteColorOptions
    secondaryGreen3: PaletteColorOptions
    secondaryMint1: PaletteColorOptions
    secondaryMint2: PaletteColorOptions
    secondaryNavy1: PaletteColorOptions
    secondaryNavy2: PaletteColorOptions
    primaryMint: PaletteColorOptions
    backgroundMint: PaletteColorOptions
    backgroundGray: PaletteColorOptions
    accentRed: PaletteColorOptions
    accentRed1: PaletteColorOptions
    accentRed2: PaletteColorOptions
    accentYellow: PaletteColorOptions
    yellow: PaletteColorOptions
    distinctiveGray: PaletteColorOptions
    backgroundRed: PaletteColorOptions
    backgroundYellow: PaletteColorOptions
    backgroundWhite: PaletteColorOptions
  }
}
