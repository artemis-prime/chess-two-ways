import type { VariantProps } from '@stitches/react'
import { styled, common } from '~/styles/stitches.config'


const buttonCommon = {
  cursor: 'pointer',
  padding: '5px 12px',
  border: '1.5px solid $gray1',
  borderRadius: '8px',
}

const Button = styled('button', {

  outline: 'none',
  p: 2,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '1.1',

  variants: {
    
    variant: {
      contained: {
        ...buttonCommon,
      },
      outlined: {
        ...buttonCommon,
        backgroundColor: 'transparent',
        color: '$gray1',
        '&:disabled': {
          cursor: 'default',
          borderColor: '$gray11',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'none',
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
          // pressed
        '&:active': {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      },
      // outlined, but with alert colors
      alert: {
        ...buttonCommon,
        color: '$gray1',
        backgroundColor: '$alert9',
        '&:hover': {
          backgroundColor: '$alert8',
        },
          // pressed
        '&:active': {
          backgroundColor: '$alert7' ,
        },
      },

      ghost: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent',
        p: 1,
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:disabled': {
          cursor: 'default',
        },
        '&:disabled:hover': {
          textDecoration: 'none',
        },
      
      },
    },
    dash: {
      true: {
        color: '$dashText',
        fontFamily: '$dash',
        '&:disabled': {
          color: '$dashTextDisabled',
        },
      }
    },
    menu: {
      true: {
//        color: '$menuText',
//        fontFamily: '$menu',
        '&:disabled': {
          color: '$menuTextDisabled',
        },
      }
    },
    size: {
      xs: {
        fontSize: '0.6rem',
      },
      small: {
        fontSize: '0.8rem',
      },
      medium: {
        fontSize: '1rem',
      },
      large: {
        fontSize: '1.2rem',
      },
    },
  },
  compoundVariants: [
    {
      dash: true,
      variant: 'contained',
      css: {
        color: '$gray1',
        backgroundColor: '$gray11',
        '&:hover': {
          backgroundColor: '$gray10'
        },
          // pressed
        '&:active': {
          backgroundColor: '$gray8' 
        },
      }  
    },
    {
      menu: true,
      variant: 'contained',
      css: {
        color: '$gray1',
        backgroundColor: '$menuContainedButton',
        '&:hover': {
          backgroundColor: '$menuContainedButtonHover'
        },
          // pressed
        '&:active': {
          backgroundColor: '$menuContainedButtonPressed' 
        },
      }  
    },
    {
      menu: true,
      variant: 'ghost',
      css: {
        ...common.menuBarTrigger,
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '$menuBG',
        px: '$1_5',
        '&:hover': {
          textDecoration: 'none',
          backgroundColor: '$menuBGHover',
          '&:disabled': {
            backgroundColor: '$menuBG',
          } 
        },
        '&:disabled': {
          cursor: 'default',
          color: '$menuTextDisabled'
        },
      }  
    },
  ],
  defaultVariants: {
    variant: 'ghost',
    size: 'medium',
    dash: true,
    menu: false
  },
})
type ButtonVariants = VariantProps<typeof Button>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type ButtonVariant = ButtonVariants['variant'] 
type ButtonSize = ButtonVariants['size'] 



export {
  Button as default,
  type ButtonVariant,
  type ButtonSize
}
