import { StyleSheet } from 'react-native'
import type * as Stitches from 'stitches-native'
import { createStitches, type CSS } from 'stitches-native'
import DeviceInfo from 'react-native-device-info'
import { gray, orange } from '@radix-ui/colors'

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
  utils: {
    // MARGIN
    m: (value:  Stitches.PropertyValue<'margin'>) => ({
      margin: value,
    }),
    mx: (value:  Stitches.PropertyValue<'margin'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value:  Stitches.PropertyValue<'margin'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    mt: (value:  Stitches.PropertyValue<'margin'>) => ({
      marginTop: value,
    }),
    mb: (value:  Stitches.PropertyValue<'margin'>) => ({
      marginBottom: value,
    }),
    ml: (value:  Stitches.PropertyValue<'margin'>) => ({
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
  },
  media: {
    phone: !isTablet,
    tablet: isTablet
  },
})

const typography = {
  menu: {
    item: css({
      fontFamily: '$menu',
      lineHeight: '$menu',
      fontWeight: '$semibold',
      fontSize: '$menu',
      color: '$dashText',
      textTransform: 'lowercase'
    }),
    title: css({
      fontFamily: '$menu',
      lineHeight: '$menu',
      fontWeight: '$semibold',
      fontSize: '$menu',
      color: '$dashText'
    })
  },
  dash: {
    normal: css({
      fontFamily: '$dash',
      lineHeight: '$common',
      fontSize: '$common',
      color: '$dashText'
    }),
    smaller: css({
      fontFamily: '$dash',
      lineHeight: '$smaller',
      fontSize: '$smaller',
      color: '$dashText'
    }),
    alertSmaller: css({
      fontFamily: '$dash',
      lineHeight: '$smaller',
      fontSize: '$smaller',
      color: '$dashAlert'
    })
  }
}

const common = {
  typography
}

export { 
  media,
  css, 
  styled,
  useTheme, 
  theme,
  ThemeProvider,  
  common,
  type CSS
} 
