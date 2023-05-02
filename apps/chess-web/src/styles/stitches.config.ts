import Stitches, { createStitches } from '@stitches/react'

// vscode doesn't seem to see the import as possible,
// Both vite and tsc seem to do just fine. Dunno
// @ts-ignore 
import fromSASS from './colors.module.scss' 

const { 
  config: { media }, 
  theme: lightTheme, 
  styled, 
} = createStitches({
  theme: {
    colors: {
      ...fromSASS    
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

export {
  media,
  lightTheme,
  styled
}
