import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  Text,
  type ViewStyle,
} from 'react-native'

import { styled, typography } from '~/style'

import ButtonShell, {type ButtonViewProps} from './ButtonShell'

const GhostButtonText = styled(Text, 
  typography.chalkboard.normal,  
  {
    variants: {
      state: {
        disabled: {},
        pressed: {},
        normal: {}
      },
      chalkboard: {
        true: {
          color: '$chalkboardTextColor',
          fontFamily: '$chalkboardFont',
        }
      },
      menu: {
        true: {
          color: '$chalkboardTextColor',
          fontFamily: '$chalkboardFont',
//          fontSize: 'inherit',
        }
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
  style
}) => (
  <GhostButtonText state={state} style={style}>
    {children}
  </GhostButtonText>
) 

const GhostButton: React.FC<{
  onClick: () => void
  style?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  children,
  onClick,
  style,
  ...rest
}) => (
  <ButtonShell {...rest} onClick={onClick} view={GhostButtonView} style={style}  >
    {children}
  </ButtonShell>
)

export default GhostButton
