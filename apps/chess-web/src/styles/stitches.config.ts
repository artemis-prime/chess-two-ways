import { createStitches, type CSS } from '@stitches/react'

// vscode doesn't seem to see the import as possible,
// Both vite and tsc seem to do just fine. Dunno
// @ts-ignore 
import fromSASS from './colors.module.scss' 
import utils from './utils.stitches'
import _media from './media.stitches'
import deborder from './debugBorder'

const HEADER_HEIGHT = 52
const HEADER_HEIGHT_SMALLER = 48
const HEADER_HEIGHT_SMALL = 42

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
      '_5': '4px',
      1: '8px',
      '1_5': '12px',
      2: '16px',
      3: '24px',
      4: '32px',
      menuPL: '16px',
    },
    fontSizes: {
      headerFontSizeSmall: '1rem',
      headerFontSizeSmaller: '1.1rem',
      headerFontSize: '1.2rem',
      normal: '1rem',
      menuDesktop: '18px',
      menuMobile: '14px',
      dashSmaller: '0.9rem'
    },
    fontWeights: {
      menuFontWeight: 500
    },
    fonts: {
      dashFont: 'chalk',
      headerFont: 'TWK Everett',
        // linked directly in index.html 
      menuFont: "'Source Sans 3'" // need both sets of quotes
    },
    lineHeights: {
      menuLineHeight: '20px'
    },
    letterSpacings: {

    },
    sizes: {
      swatchNormalHeight: '22px',
      swatchNormalWidth: '42px', 
      headerHeight: `${HEADER_HEIGHT}px`,
      headerHeightSmaller: `${HEADER_HEIGHT_SMALLER}px`,
      headerHeightSmall: `${HEADER_HEIGHT_SMALL}px`,
      sideMenuItemHeight: '52px',
      popupMenuItemHeight: '42px'
    },
    radii: {
      none: 0,
      sm: '3px',
      md: '8px',
      lgr: '12px',
      lg: '16px',
      rounded: '999px',
      menuRadius: '999px',
      popupMenuRadius: '21px', // popupMenuItemHeight * 0.5
    },
    shadows: {
      shallowShadow: '1px 2px 2px rgba(0, 0, 0, 0.12);',
    },
    transitions: {
      dashInPortrait: 'height 300ms ease'
    },
    breakpoints: {},
  },
})

const common = {
  sideMenuItem: {
    borderRadius: '$menuRadius',
    height: '$sideMenuItemHeight',
    pl: '$menuPL',
    lineHeight: '$menuLineHeight',
    fontSize: '$menuDesktop',
    fontFamily: '$menuFont',
    fontWeight: '$menuFontWeight',
  },
  menuBarTrigger: {
    borderRadius: '$menuRadius',
    px: '$3',
    color: '$menuTextColor',
    lineHeight: 'inherit',
    fontSize: 'inherit',
    fontFamily: '$headerFont',
    fontWeight: '$menuFontWeight',
    cursor: 'pointer',
  },
  menuBarPopupItem: {
    borderRadius: '$menuRadius',
    height: '$popupMenuItemHeight',
    px: '$menuPL',
    color: '$menuTextColor',
    lineHeight: '$popupMenuItemHeight',
    fontSize: '$menuDesktop',
    fontFamily: '$menuFont',
    fontWeight: '$menuFontWeight',
    cursor: 'pointer',
  }
}

export {
  media,
  lightTheme,
  styled,
  css,
  common,
  deborder,
  type CSS
}
