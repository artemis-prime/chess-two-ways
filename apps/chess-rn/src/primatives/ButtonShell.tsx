import React, { type PropsWithChildren, useState } from 'react'
import { 
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import type UnicodeIcon from './UnicodeIcon'

type  ButtonState = 'default' | 'pressed' | 'disabled'

interface ButtonViewProps extends PropsWithChildren {
  state: ButtonState
  icon?: UnicodeIcon, 
  style?: StyleProp<ViewStyle>
}

const ButtonShell: React.FC<{
  view: React.ComponentType<ButtonViewProps>
  onClick: () => void
  icon?: UnicodeIcon,
  style?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  view,
  onClick,
  style,
  icon, 
  disabled = false,
  children,
  ...rest
}) => {

  const [buttonState, setButtonState] = useState<ButtonState>('default')

  const ButtonView = view // must convert the referenced variable to uppercase

  const onPressIn = (e: GestureResponderEvent): void => {
    setButtonState('pressed')
  }

  const onPressOut = (e: GestureResponderEvent): void => {
    setButtonState('default')
  }

  const onPress = (e: GestureResponderEvent): void => {
    onClick()
  }

  return (
    <Pressable {...rest} {...{onPressIn, onPressOut, onPress, disabled}} >
      <ButtonView state={(disabled) ? 'disabled' : buttonState} style={style} icon={icon}>
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
