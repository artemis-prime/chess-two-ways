import { styled } from '~/styles/stitches.config'


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
        color: '$gray1',
        backgroundColor: '$gray11',
        '&:hover': {
          backgroundColor: '$gray10'
        },
          // pressed
        '&:active': {
          backgroundColor: '$gray8' 
        },
      },
      outlined: {
        ...buttonCommon,
        backgroundColor: 'transparent',
        color: '$gray1',
        '&:disabled': {
          cursor: 'default',
          color: '$gray12',
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
  defaultVariants: {
    variant: 'ghost',
    size: 'medium',
  },
})


export type ButtonVariant = "contained" | "outlined" | "alert" | "ghost" 

export default Button
