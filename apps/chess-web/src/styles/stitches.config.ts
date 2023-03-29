import {
  slate,
  slateDark,
  violet,
  violetDark,
  green,
  greenDark,
  whiteA,
  red,
  redDark,
  gray,
  grayDark,
  blackA,
} from '@radix-ui/colors'

import { createStitches } from '@stitches/react'
import type * as Stitches from '@stitches/react'
import reset from '~/util/cssreset'

const customGrayDark = {
      
      // First 4 according to current usage (Zach),
      // rest from radix.
      // Following https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
    gray1: '#000', 
    gray2: '#0a0a0a',
    gray3: '#1a1a1a',
    gray4: '#222',
      // grayDark from here
    gray5: grayDark.gray5,
    gray6: grayDark.gray6,
    gray7: grayDark.gray7,
    gray8: grayDark.gray8,
    gray9: grayDark.gray9,
    gray10: grayDark.gray10,
    gray11: grayDark.gray11,
    gray12: grayDark.gray12,
}

export const { 
  createTheme, 
  config: { media }, 
  theme: lightTheme, 
  keyframes, 
  styled, 
  getCssText,
  globalCss,
} =
  createStitches({
    theme: {
      colors: {
        ...whiteA,
        ...blackA,
        ...green,
        ...gray,
        ...violet,

          // Primary == slateDark
        primary1: slateDark.slate1,
        primary2: slateDark.slate2,
        primary3: slateDark.slate3,
        primary4: slateDark.slate4,
        primary5: slateDark.slate5,
        primary6: slateDark.slate6,
        primary7: slateDark.slate7,
        primary8: slateDark.slate8,
        primary9: slateDark.slate9,
        primary10: slateDark.slate10,
        primary11: slateDark.slate11,
        primary12: slateDark.slate12,
      
          // Secondary == slate
        secondary1: slate.slate1,
        secondary2: slate.slate2,
        secondary3: slate.slate3,
        secondary4: slate.slate4,
        secondary5: slate.slate5,
        secondary6: slate.slate6,
        secondary7: slate.slate7,
        secondary8: slate.slate8,
        secondary9: slate.slate9,
        secondary10: slate.slate10,
        secondary11: slate.slate11,
        secondary12: slate.slate12,
    
        colorOne1: violet.violet1,
        colorOne2: violet.violet2,
        colorOne3: violet.violet3,
        colorOne4: violet.violet4,
        colorOne5: violet.violet5,
        colorOne6: violet.violet6,
        colorOne7: violet.violet7,
        colorOne8: violet.violet8,
        colorOne9: violet.violet9,
        colorOne10: violet.violet10,
        colorOne11: violet.violet11,
        colorOne12: violet.violet12,
        colorOneText: 'white',
        colorOneTextFaded: violetDark.violet1,
    
        alert1: red.red1,
        alert2: red.red2,
        alert3: red.red3,
        alert4: red.red4,
        alert5: red.red5,
        alert6: red.red6,
        alert7: red.red7,
        alert8: red.red8,
        alert9: red.red9,
        alert10: red.red10,
        alert11: red.red11,
        alert12: red.red12,
        alertText: '#fff',
        alertTextFaded: '#fee',
    
        neutralBg: 'white',
        neutralBgSubtle: 'white',
        panelShadow: 'rgba(0,0,0,0.1)',
        panelBg: '$gray2',
        panelBorder: 'transparent',
        lowestContrast: 'white',
        highestContrast: 'black',
      },
      space: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '32px',
        6: '64px',
      },
      fontSizes: {},
      fontWeights: {},
      fonts: {
        body: 'Source Sans Pro',
        button: 'TWK Everett',
      },
      lineHeights: {},
      letterSpacings: {},
      sizes: {},
      radii: {},
      shadows: {
        shallowShadow: '1px 2px 2px rgba(0, 0, 0, 0.12);',
      },
      transitions: {},
      breakpoints: {
        sm: 100,
      },
    },
    utils: {
      // MARGIN
      m: (value: Stitches.PropertyValue<'margin'>) => ({
        margin: value,
      }),
      mx: (value: Stitches.PropertyValue<'margin'>) => ({
        marginLeft: value,
        marginRight: value,
      }),
      my: (value: Stitches.PropertyValue<'margin'>) => ({
        marginTop: value,
        marginBottom: value,
      }),
      mt: (value: Stitches.PropertyValue<'margin'>) => ({
        marginTop: value,
      }),
      mb: (value: Stitches.PropertyValue<'margin'>) => ({
        marginBottom: value,
      }),
      ml: (value: Stitches.PropertyValue<'margin'>) => ({
        marginLeft: value,
      }),
      mr: (value: Stitches.PropertyValue<'margin'>) => ({
        marginRight: value,
      }),

      // PADDING
      p: (value: Stitches.PropertyValue<'padding'>) => ({
        padding: value,
      }),
      px: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      py: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      pt: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingTop: value,
      }),
      pb: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingBottom: value,
      }),
      pl: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingLeft: value,
      }),
      pr: (value: Stitches.PropertyValue<'padding'>) => ({
        paddingRight: value,
      }),
      // DIMENSIONS
      w: (value: Stitches.PropertyValue<'width'>) => ({
        width: value,
      }),
      h: (value: Stitches.PropertyValue<'height'>) => ({
        height: value,
      }),
      size: (value: Stitches.PropertyValue<'width'>) => ({
        width: value,
        height: value,
      }),
      // GRID
      colSpan: (value: number | 'full') => {
        if (value === 'full') {
          return {
            gridColumn: '1 / -1',
          }
        }
        return {
          gridColumn: `span ${value} / span ${value}`,
        }
      },
    },
    media: {
      sm: '(min-width: 600px)',
      md: '(min-width: 900px)',
      lg: '(min-width: 1200px)',
      xl: '(min-width: 1400px)',
      bp300: '(min-width: 300px)',
      bp400: '(min-width: 400px)',
      bp500: '(min-width: 500px)',
      bp600: '(min-width: 600px)',
      bp700: '(min-width: 700px)',
      bp800: '(min-width: 800px)',
      bp900: '(min-width: 900px)',
      bp1000: '(min-width: 1000px)',
      bp1100: '(min-width: 1100px)',
      bp1200: '(min-width: 1200px)',
      bp1300: '(min-width: 1300px)',
      bp1400: '(min-width: 1400px)',
      motion: '(prefers-reduced-motion)',
      hover: '(any-hover: hover)',
      dark: '(prefers-color-scheme: dark)',
      light: '(prefers-color-scheme: light)',
    },
  })

export const globalReset = globalCss(reset)

export const darkTheme = createTheme({
  colors: {
    ...whiteA,
    ...blackA,
    ...greenDark,
    ...violetDark,
    ...customGrayDark,

      // Primary == slate
    primary1: slate.slate1,
    primary2: slate.slate2,
    primary3: slate.slate3,
    primary4: slate.slate4,
    primary5: slate.slate5,
    primary6: slate.slate6,
    primary7: slate.slate7,
    primary8: slate.slate8,
    primary9: slate.slate9,
    primary10: slate.slate10,
    primary11: slate.slate11,
    primary12: slate.slate12,

    // Secondary == slateDark
    secondary1: slateDark.slate1,
    secondary2: slateDark.slate2,
    secondary3: slateDark.slate3,
    secondary4: slateDark.slate4,
    secondary5: slateDark.slate5,
    secondary6: slateDark.slate6,
    secondary7: slateDark.slate7,
    secondary8: slateDark.slate8,
    secondary9: slateDark.slate9,
    secondary10: slateDark.slate10,
    secondary11: slateDark.slate11,
    secondary12: slateDark.slate12,

    colorOne1: violetDark.violet1,
    colorOne2: violetDark.violet2,
    colorOne3: violetDark.violet3,
    colorOne4: violetDark.violet4,
    colorOne5: violetDark.violet5,
    colorOne6: violetDark.violet6,
    colorOne7: violetDark.violet7,
    colorOne8: violetDark.violet8,
    colorOne9: violetDark.violet9,
    colorOne10: violetDark.violet10,
    colorOne11: violetDark.violet11,
    colorOne12: violetDark.violet12,
    colorOneText: violetDark.violet12,
    colorOneTextFaded: violetDark.violet11,

    alert1: redDark.red1,
    alert2: redDark.red2,
    alert3: redDark.red3,
    alert4: redDark.red4,
    alert5: redDark.red5,
    alert6: redDark.red6,
    alert7: redDark.red7,
    alert8: redDark.red8,
    alert9: redDark.red9,
    alert10: redDark.red10,
    alert11: redDark.red11,
    alert12: redDark.red12,
    alertText: redDark.red12,
    alertTextFaded: redDark.red11,

    neutralBgSubtle: grayDark.gray2, 
    neutralBg: 'black',

    panelBg: grayDark.gray2, 
    panelBorder: 'black',
    panelShadow: 'transparent',

    lowestContrast: 'black',
    highestContrast: 'white',

  },
})
