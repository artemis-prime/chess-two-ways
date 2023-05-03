import { StyleSheet } from 'react-native'
import type * as Stitches from 'stitches-native'
import { createStitches } from 'stitches-native'
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
      common: 'IDidThis'
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
      1: 4,
      2: 7,
      3: 11,
      4: 16,
      5: LINEHEIGHTS.smaller,
      6: LINEHEIGHTS.common,
      7: LINEHEIGHTS.menu,
      8: 52,
      9: 64,
      max: '$9' as const,
    },
    sizes: {
      hairlineWidth: StyleSheet.hairlineWidth,
      ...LINEHEIGHTS,
      appBarHeight: 42,
      swatchNormalHeight: LINEHEIGHTS.common * 0.7,
      swatchNormalWidth: LINEHEIGHTS.common * 1.3, 
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

const common = {
  menuTextCommon: css({
    fontFamily: 'sans',
    lineHeight: '$menu',
    fontWeight: '$semibold',
    fontSize: '$menu',
    color: '$dashText',
    textTransform: 'lowercase'
  }),
  menuTextTitle: css({
    fontFamily: 'sans',
    lineHeight: '$menu',
    fontWeight: '$semibold',
    fontSize: '$menuTitle',
    color: '$dashText'
  }),
  dashTextCommon: css({
    fontFamily: '$common',
    lineHeight: '$common',
    fontSize: '$common',
    color: '$dashText'
  }),
  dashTextSmaller: css({
    fontFamily: '$common',
    lineHeight: '$smaller',
    fontSize: '$smaller',
    color: '$dashText'
  }),
  dashTextAlertSmaller: css({
    fontFamily: '$common',
    lineHeight: '$smaller',
    fontSize: '$smaller',
    color: '$dashAlert'
  })
}

export { 
  media,
  css, 
  styled,
  useTheme, 
  theme,
  ThemeProvider,  
  common
} 
