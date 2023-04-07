import { styled } from '~/styles/stitches.config'

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
        color: '$colorOneText',
        backgroundColor: '$colorOne9',
        '&:hover': {
          backgroundColor: '$colorOne8',
        },
          // pressed
        '&:active': {
          backgroundColor: '$colorOne7', 
        },
      },
      outlined: {
        cursor: 'pointer',
        backgroundColor: 'transparent',
        padding: '5px 12px',
        border: '1.5px solid $gray1',
        borderRadius: '8px',
        color: '$gray1',
        '&:disabled': {
          cursor: 'default',
          color: '$gray11',
          borderColor: '$gray11',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'none',
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          //textDecoration: 'underline',
        },
          // pressed
        '&:active': {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          //backgroundColor: '$gray9',
        },
      },
      alert: {
        color: '$alertText',
        backgroundColor: '$alert9',
        '&:hover': {
          backgroundColor: '$alert8',
        },
          // pressed
        '&:active': {
          backgroundColor: '$alert7', 
        },
      },

      ghost: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent',
        color: '$gray1',
        p: 1,
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:disabled': {
          cursor: 'default',
          color: '$gray11',
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


export type ButtonVariant = " contained" | "outlined" | "alert" | "ghost" 

export default Button
