import { StyleSheet } from 'react-native'
import { createStitches } from 'stitches-native'
import DeviceInfo from 'react-native-device-info'
import { gray, orange } from '@radix-ui/colors'

import utils from './utils.stitches'

const isTablet = DeviceInfo.isTablet()

const LINEHEIGHTS = {
  menu: 40,
  common: 34,
  smaller: 28
} 

// Cf: https://github.com/Temzasse/stitches-native/blob/main/example/src/styles/styled.ts#L56
const { 
  config: { media },
  css, 
  styled,
  useTheme, 
  theme,
  ThemeProvider  
} = createStitches({

  utils,
  media: {
    phone: !isTablet,
    tablet: isTablet
  },
  theme: {
      // Cf: apps/chess-web/src/style/colors.module.scss
    colors: {
      ...gray,
      ...orange,

      alert1: '$orange1',
      alert2: '$orange2',
      alert3: '$orange3',
      alert4: '$orange4',
      alert5: '$orange5',
      alert6: '$orange6',
      alert7: '$orange7',
      alert8: '$orange8',
      alert9: '$orange9',
      alert10: '$orange10',
      alert11: '$orange11',
      alert12: '$orange12',

      pieceBlack: '#573131',
      pieceWhite: '#f7f0be',
      dashBorder: 'rgba(167, 107, 55, 0.761)',
      dashAlert: '$orange8',
      dashText: '$gray7',
      headerBG: '#274070', 
      boardSquareBrown: 'rgba(124, 79, 52, 0.60)',
    },
    fonts: {
      dash: 'IDidThis',
      menu: 'Roboto'
    },
    fontWeights: {
      bold: '700',
      semibold: '500',
      normal: '400',
    },
    borderStyles: {
      solid: 'solid',
    },
    borderWidths: {
      hairline: StyleSheet.hairlineWidth,
      normal: 1,
      thicker: 2,
      thick: 3,
    },
    fontSizes: {
      common: LINEHEIGHTS.common * 0.6,
      smaller: LINEHEIGHTS.smaller * 0.6,  
      larger: LINEHEIGHTS.common * 0.7,
      menu: LINEHEIGHTS.menu * .5,
      menuTitle: LINEHEIGHTS.menu * .8
    },
    lineHeights: {
      ...LINEHEIGHTS
    },
    letterSpacings: {
      tight: 0.1,
      sparse: 1,
    },
    zIndices: {
      modal: 1000,
    },
    space: {
      none: 0,
      half: 4,
      single: 7,
      singleAndHalf: 11,
      double: 16,
      triple: 23,
      menuSeparatorPY: 7,
      menuPY: 7,
      menuPX: 11,
      smallerLine: LINEHEIGHTS.smaller,
      normalLine: LINEHEIGHTS.common,
      menuLine: LINEHEIGHTS.menu,
      appBar: 42,
      big: 64,
    },
    sizes: {
      hairlineWidth: StyleSheet.hairlineWidth,
      ...LINEHEIGHTS,
      appBarHeight: 42,
      swatchHNormal: LINEHEIGHTS.common * 0.7,
      swatchWNormal: LINEHEIGHTS.common * 1.3, 
      swatchHSmall: LINEHEIGHTS.common * 0.6,
      swatchWSmall: LINEHEIGHTS.common * 0.6,
      menuIconSize: 24,
    },
    radii: {
      none: 0,
      sm: 3,
      md: 8,
      lg: 16,
      rounded: 999,
    },
  },    
})

export { 
  media,
  css, 
  styled,
  useTheme, 
  theme,
  ThemeProvider,  
} 
