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
        backgroundColor: '$secondary2',
        border: '1.5px solid $secondary12',
        color: '$secondary12',
        '&:hover': {
          backgroundColor: '$secondary8',
        },
          // pressed
        '&:active': {
          backgroundColor: '$secondary9',
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
          //color: '$gray11',
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
    {
      size: 'xs',
      css: {
        height: 40,
        width: 40,
        p: 0,
      },
    },
    {
      size: 'small',
      css: {
        height: 44,
        width: 44,
        p: 0,
      },
    },
    {
      size: 'medium',
      css: {
        height: 44,
        width: 44,
        p: 0,
      },
    },
    {
      size: 'large',
      css: {
        height: 52,
        width: 52,
        p: 0,
      },
    },
  ],
  defaultVariants: {
    variant: 'ghost',
    size: 'medium',
  },
})


export type ButtonVariant = " contained" | "outlined" | "alert" | "ghost" 

export default Button
