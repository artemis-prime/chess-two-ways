import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  Text,
  View,
} from 'react-native'

import { styled, typography, type CSS } from '~/style'

import ButtonShell, {type ButtonViewProps} from './ButtonShell'

const GhostButtonBG = styled(View, 
  {
    borderRadius: '$menuRadius',
    backgroundColor: 'transparent',
    variants: {
      state: {
        disabled: {},
        pressed: {},
        normal: {}
      },
      chalkboard: {
        true: {}
      },
      menu: {
        true: { }
      },
    },
    compoundVariants: [
      {
        chalkboard: true,
        state: 'pressed',
        css: {
          color: '$chalkboardButtonPressedBG',
        }
      },
      {
        menu: true,
        state: 'pressed',
        css: {
          color: '$menuBGColorPressed',
        }
      },
    ]
  }
)

const GhostButtonText = styled(Text, 
  {
    variants: {
      state: {
        disabled: {},
        pressed: {},
        normal: {}
      },
      chalkboard: {
        true: { ...typography.chalkboard.normal }
      },
      menu: {
        true: { ...typography.menu.sectionTitle }
      },
    },
    compoundVariants: [
      {
        chalkboard: true,
        state: 'disabled',
        css: {
          color: '$chalkboardTextColorDisabled',
        }
      },
      {
        menu: true,
        state: 'disabled',
        css: {
          color: '$menuTextColorDisabled',
        }
      },
    ]
  }
)

const GhostButtonView: React.FC<ButtonViewProps> = ({
  state,
  children,
  css
}) => (
  <GhostButtonBG css={css}>
    <GhostButtonText state={state} >
      {children}
    </GhostButtonText>
  </GhostButtonBG>
) 

const GhostButton: React.FC<
  {
    onClick: () => void
    css?: CSS
  } 
  & PropsWithChildren 
  & Omit<PressableProps, 'style'>
> = ({
  children,
  ...rest
}) => (
  <ButtonShell {...rest} view={GhostButtonView}  >
    {children}
  </ButtonShell>
)

export default GhostButton
