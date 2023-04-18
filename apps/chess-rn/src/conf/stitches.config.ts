import { StyleSheet } from 'react-native'
import { createStitches } from 'stitches-native'
import DeviceInfo from 'react-native-device-info'
import { gray, orange } from '@radix-ui/colors'

const isTablet = DeviceInfo.isTablet()

// Cf: https://github.com/Temzasse/stitches-native/blob/main/example/src/styles/styled.ts#L56

export const { 
  config: { media },
  css, 
  theme: lightTheme, 
  styled,
  useTheme, 
  ThemeProvider,  
} = createStitches({
    theme: {
        // Cf: web-ui/src/style/colors.module.scss
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
        dashAlert: '$alert8',
        dashText: '$gray7',
        headerBG: '#274070', 
        //brownDarker: 'rgba(105, 49, 49, 0.75)',
        //brownDarker: '#7c5934',
        boardSquareBrown: 'rgba(124, 79, 52, 0.60)',
      },
      fonts: {
        
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
        thin: StyleSheet.hairlineWidth,
        normal: 1,
        thick: 2,
      },
      fontSizes: {
        xxs: 10,
        xs: 14,
        sm: 16,
        md: 18,
        lg: 20,
        xl: 24,
        xxl: 32,
      },
      lineHeights: {
        xxs: 12,
        xs: 16,
        sm: 18,
        md: 20,
        lg: 24,
        xl: 28,
        xxl: 36,
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
        2: 8,
        3: 16,
        4: 24,
        5: 32,
        6: 40,
        7: 56,
        8: 72,
        9: 96,
        max: '$9' as const,
      },
      sizes: {
        hairlineWidth: StyleSheet.hairlineWidth,
      },
      radii: {
        sm: 4,
        md: 8,
        lg: 24,
        full: 999,
      },
    },    
    utils: {
      // MARGIN
      m: (value: number) => ({
        margin: value,
      }),
      mx: (value: number) => ({
        marginLeft: value,
        marginRight: value,
      }),
      my: (value: number) => ({
        marginTop: value,
        marginBottom: value,
      }),
      mt: (value: number) => ({
        marginTop: value,
      }),
      mb: (value: number) => ({
        marginBottom: value,
      }),
      ml: (value: number) => ({
        marginLeft: value,
      }),
      mr: (value: number) => ({
        marginRight: value,
      }),

      // PADDING
      p: (value: number) => ({
        padding: value,
      }),
      px: (value: number) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      py: (value: number) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      pt: (value: number) => ({
        paddingTop: value,
      }),
      pb: (value: number) => ({
        paddingBottom: value,
      }),
      pl: (value: number) => ({
        paddingLeft: value,
      }),
      pr: (value: number) => ({
        paddingRight: value,
      }),
      // DIMENSIONS
      w: (value: any) => ({
        width: value,
      }),
      h: (value: any) => ({
        height: value,
      }),
      size: (value: any) => ({
        width: value,
        height: value,
      }),
      shadow: (level: 'small' | 'medium' | 'large') => {
        return {
          small: {
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 3,
            shadowOpacity: 0.1,
            shadowColor: '#000',
          },
          medium: {
            elevation: 5,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 6,
            shadowOpacity: 0.2,
            shadowColor: '#000',
          },
          large: {
            elevation: 10,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            shadowOpacity: 0.4,
            shadowColor: '#000',
          },
        }[level]
      },
    },
    media: {
      phone: !isTablet,
      tablet: isTablet
    },
  })
