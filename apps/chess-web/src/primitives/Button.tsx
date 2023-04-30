import React from 'react'
import { styled } from '~/styles/stitches.config'

import c from '~/styles/colors'

const buttonCommon = {
  cursor: 'pointer',
  padding: '5px 12px',
  border: `1.5px solid ${c.gray[1]}`,
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
        color: c.gray[1],
        backgroundColor: c.gray[11],
        '&:hover': {
          backgroundColor: c.gray[10],
        },
          // pressed
        '&:active': {
          backgroundColor: c.gray[8], 
        },
      },
      outlined: {
        ...buttonCommon,
        backgroundColor: 'transparent',
        color: c.gray[1],
        '&:disabled': {
          cursor: 'default',
          color: c.gray[12],
          borderColor: c.gray[11],
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
        color: c.gray[1],
        backgroundColor: c.alert[9],
        '&:hover': {
          backgroundColor: c.alert[8],
        },
          // pressed
        '&:active': {
          backgroundColor: c.alert[7], 
        },
      },

      ghost: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent',
        color: c.gray[1],
        p: 1,
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:disabled': {
          cursor: 'default',
          color: c.gray[11],
        },
        '&:disabled:hover': {
          textDecoration: 'none',
        },
      
      },
    },
    size: {
      xs: {
        fontSize: '12px',
      },
      small: {
        fontSize: '14px',
      },
      medium: {
        fontSize: '16px',
      },
      large: {
        fontSize: '18px',
      },
    },
  },
  compoundVariants: [
  ],
  defaultVariants: {
    variant: 'ghost',
    size: 'medium',
  },
})


export type ButtonVariant = "contained" | "outlined" | "alert" | "ghost" 

export default Button
