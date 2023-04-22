import React, { PropsWithChildren } from 'react'
import { 
  PressableProps,
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native'

import { styled, common } from '~/style/stitches.config'

import ButtonShell, {type ButtonViewProps} from './ButtonShell'

const GhostStyledText = styled(Text, 
  common.dashTextCommon,  
  {
    variants: {
      state: {
        disabled: {
          color: '$gray9'
        },
        pressed: {
          color: '$gray3',
          textDecorationLine: 'underline',
        },
        default: {}
      }
    }
  }
)

const GhostText: React.FC<ButtonViewProps> = ({
  state,
  children,
  style
}) => (
  <GhostStyledText state={state} style={style}>
    {children}
  </GhostStyledText>
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
  <ButtonShell {...rest} onClick={onClick} view={GhostText} style={style}  >
    {children}
  </ButtonShell>
)

export default GhostButton
