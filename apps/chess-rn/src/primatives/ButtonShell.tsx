import React, { type PropsWithChildren, useState } from 'react'
import { 
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import type UnicodeIcon from './UnicodeIcon'

type ButtonState = 'normal' | 'pressed' | 'disabled'

interface ButtonViewProps extends PropsWithChildren {
  state: ButtonState
  icon?: UnicodeIcon, 
  style?: StyleProp<ViewStyle>
}

interface ButtonShellProps extends Omit<PressableProps, 'children'>, PropsWithChildren {
  view: React.FC<ButtonViewProps>,
  onClick: () => void
  viewProps?: {[key in string]: any}
  icon?: UnicodeIcon,
  style?: StyleProp<ViewStyle>
} 

const ButtonShell: React.FC<ButtonShellProps> = ({
  view,
  onClick,
  style,
  icon, 
  viewProps,
  disabled = false,
  children,
  ...rest
}) => {

  const [buttonState, setButtonState] = useState<ButtonState>('normal')

  const ButtonView = view // must convert the referenced variable to uppercase

  const onPressIn = (e: GestureResponderEvent): void => {
    setButtonState('pressed')
  }

  const onPressOut = (e: GestureResponderEvent): void => {
    setButtonState('normal')
  }

  const onPress = (e: GestureResponderEvent): void => {
    onClick()
  }

  return (
    <Pressable {...rest} {...{onPressIn, onPressOut, onPress, disabled}} >
      <ButtonView state={(disabled) ? 'disabled' : buttonState} style={style} icon={icon} {...rest} {...viewProps}>
        {children}
      </ButtonView>
    </Pressable>
  )
} 

export {
  ButtonShell as default,
  type ButtonViewProps,
  type ButtonState
}
