import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  Text,
  type ViewStyle,
} from 'react-native'

import { styled, common } from '~/styles/stitches.config'

import ButtonShell, {type ButtonViewProps} from './ButtonShell'

const GhostStyledText = styled(Text, 
  common.typography.dash.normal,  
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
        normal: {}
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
