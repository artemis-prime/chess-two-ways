import React, { PropsWithChildren, useState } from 'react'
import { 
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'

type  ButtonState = 'default' | 'pressed' | 'disabled'

interface ButtonViewProps extends PropsWithChildren {
  state: ButtonState
  style?: StyleProp<ViewStyle>
}

const ButtonShell: React.FC<{
  view: React.ComponentType<ButtonViewProps>
  onClick: () => void
  viewStyle?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  view,
  onClick,
  viewStyle,
  disabled,
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
      <ButtonView state={disabled ? 'disabled' : buttonState} style={viewStyle} >
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
