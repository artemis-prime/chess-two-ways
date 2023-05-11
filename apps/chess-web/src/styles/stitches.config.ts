import { createStitches, type CSS } from '@stitches/react'

// vscode doesn't seem to see the import as possible,
// Both vite and tsc seem to do just fine. Dunno
// @ts-ignore 
import fromSASS from './colors.module.scss' 
import utils from './utils.stitches'
import _media from './media.stitches'

const HEADER_HEIGHT = 52
const HEADER_HEIGHT_SMALLER = 48

const layout = {
  staging: 1200,
  menuBreak: 950
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
      menuDisabled: '#c8c8c8',
      menuRightSymbol: '#ddd'
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
      header: '1.85rem',
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
        // linked directly in index.html 
      //menu: 'Roboto' 
        // linked directly in index.html 
      menu: "'Source Sans 3'" // need both sets of quotes
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
      sidemenuItemHeight: '52px',
      popupmenuItemHeight: '42px'
    },
    radii: {
      none: 0,
      sm: '3px',
      md: '8px',
      lg: '16px',
      rounded: '999px',
      menu: '999px',
      popupMenu: '21px', // popupmenuItemHeight * 0.5
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
    height: '$sidemenuItemHeight',
    pl: '$menuPL',
    lineHeight: '$menu',
    fontSize: '$menuDesktop',
    fontFamily: '$menu',
    fontWeight: '$menu',
  },
  menuBarTrigger: {
    borderRadius: '$menu',
    height: '$header',
    px: '$4',
    color: 'white',
    lineHeight: '$menu',
    fontSize: '$menuDesktop',
    fontFamily: '$header',
    fontWeight: '$menu',
    cursor: 'pointer',
  },
  menuBarPopupItem: {
    borderRadius: '$menu',
    height: '$popupmenuItemHeight',
    px: '$menuPL',
    color: 'white',
    lineHeight: '$popupmenuItemHeight',
    fontSize: '$menuDesktop',
    fontFamily: '$menu',
    fontWeight: '$menu',
    cursor: 'pointer',
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
