import { styled } from '~/styles/stitches.config'

const Button = styled('button', {
  outline: 'none',
  fontWeight: 700,
  fontSize: 16,
  fontFamily: '$button',
  gap: '$space$2',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '20px',

  /* No special focus behavior TODO: accessibility issue
  $$focusColor: '$colors$gray12',
  '&:focus-visible': {
    boxShadow: '0 0 0 2px $$focusColor',
  },
  */

  '&:disabled': {
    backgroundColor: '$gray8',
    color: '$gray11',
  },
  '&:disabled:hover': {
    backgroundColor: '$gray8',
    color: '$gray11',
  },
  variants: {
    
    variant: {
      containedBW: {
        color: '$primary12',
        backgroundColor: '$primary5',
        '&:hover': {
            // reverse this, since its a reverse scale
          color: '$lowestContrast',
          backgroundColor: '$primary8',
        },
          // pressed
        '&:active': {
          color: '$primary4',
          backgroundColor: '$primary11', 
        },
      },
      containedColor: {
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
      outlinedBW: {
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

      gray: {
        backgroundColor: '$gray3',
        color: '$gray12',
        '&:hover': {
          backgroundColor: '$gray5',
        },
      },

      grayStronger: {
        backgroundColor: '$gray4',
        color: '$gray12',
        '&:hover': {
          backgroundColor: '$gray6',
        },
      },

      ghost: {
        backgroundColor: 'transparent',
        color: '$gray11',
        p: 0,
      },
    },
    corners: {
      square: {
        borderRadius: 0,
      },
      rounded: {
        borderRadius: 10,
      },
      pill: {
        borderRadius: 99999,
      },
      circle: {
        borderRadius: '99999px',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    size: {
      xs: {
        p: '$space$3',
        lineHeight: '16px',
        minHeight: 40,
      },
      small: {
        px: '$space$3',
        py: '$space$4',
        lineHeight: '12px',
        minHeight: 44,
      },
      medium: {
        px: '$space$5',
        py: '$space$3',
        minHeight: 44,
      },
      large: {
        px: '$space$5',
        py: '$space$4',
        minHeight: 52,
      },
    },
  },
  compoundVariants: [
    {
      size: 'xs',
      corners: 'circle',
      css: {
        height: 40,
        width: 40,
        p: 0,
      },
    },
    {
      size: 'small',
      corners: 'circle',
      css: {
        height: 44,
        width: 44,
        p: 0,
      },
    },
    {
      size: 'medium',
      corners: 'circle',
      css: {
        height: 44,
        width: 44,
        p: 0,
      },
    },
    {
      size: 'large',
      corners: 'circle',
      css: {
        height: 52,
        width: 52,
        p: 0,
      },
    },
  ],
  defaultVariants: {
    variant: 'containedBW',
    corners: 'rounded',
    size: 'medium',
  },
})


export type ButtonVariant = "containedBW" | "containedColor" | "outlinedBW" | "alert" | "gray" | "grayStronger" | "ghost" 

export default Button
