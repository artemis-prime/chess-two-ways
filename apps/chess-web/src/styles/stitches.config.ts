import Stitches, { createStitches, type CSS } from '@stitches/react'

// vscode doesn't seem to see the import as possible,
// Both vite and tsc seem to do just fine. Dunno
// @ts-ignore 
import fromSASS from './colors.module.scss' 
import utils from './utils.stitches'
import _media from './media.stitches'

const HEADER_HEIGHT = 52
const HEADER_HEIGHT_SMALLER = 48

const layout = {
  staging: 1100,
  menuBreak: 900
}

const { 
  config: { media }, 
  theme: lightTheme, 
  styled, 
  css
} = createStitches({

  utils,
  media: _media,
  
  theme: {
    colors: {
      ...fromSASS,
      menu: 'hsl(226, 56.0%, 34.5%)',    
      menuHover: 'hsl(226, 39.2%, 42%)',
      menuSelectedHover: 'hsl(226, 39.2%, 46%)',
      menuPressed: 'hsl(226, 39.2%, 52%)',
    },
    borderStyles: {
      solid: 'solid',
    },
    borderWidths: {
      hairline: '0.5px',
      normal: '1px',
      thicker: '2px',
      thick: '3px',
    },
    space: {
      half: '4px',
      1: '8px',
      oneAndHalf: '12px',
      2: '16px',
      3: '24px',
      4: '32px',
      menuPL: '16px',
      //menuPR: '24px',
      subheader: '42px',
      header: `${HEADER_HEIGHT}px`,
    },
    fontSizes: {
      header: '2rem',
      normal: '1rem',
      menuDesktop: '18px',
      menuMobile: '14px',
      dashSmaller: '0.9rem'
    },
    fontWeights: {
      menu: 500
    },
    fonts: {
      body: 'chalk',
      header: 'TWK Everett',
      //menu: 'Roboto' // linked directly in index.html 
      menu: "'Source Sans 3'"
    },
    lineHeights: {
      menu: '20px'
    },
    letterSpacings: {},

    sizes: {
      swatchNormalHeight: '22px',
      swatchNormalWidth: '42px', 
      header: `${HEADER_HEIGHT}px`,
      headerSmaller: `${HEADER_HEIGHT_SMALLER}px`,
      menuItemHeight: '56px'
    },
    radii: {
      none: 0,
      sm: '3px',
      md: '8px',
      lg: '16px',
      rounded: '999px',
      menu: '999px'
    },
    shadows: {
      shallowShadow: '1px 2px 2px rgba(0, 0, 0, 0.12);',
    },
    transitions: {},
    breakpoints: {},
  },
})

const common = {
  menu: {
    borderRadius: '$menu',
    height: '$menuItemHeight',
    pl: '$menuPL',
    
    lineHeight: '$menu',
    fontSize: '$menuDesktop',
    fontFamily: '$menu',
    fontWeight: '$menu',
  }
}


export {
  media,
  lightTheme,
  styled,
  css,
  layout,
  common,
  type CSS
}
