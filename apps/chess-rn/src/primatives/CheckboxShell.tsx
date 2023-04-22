import React, { PropsWithChildren, useEffect, useState } from 'react'
import { 
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'

type CheckboxState = 'checked' | 'unchecked' | 'pressed' | 'disabled'

interface CheckboxViewProps extends PropsWithChildren {
  checked: boolean,
  pressed?: boolean,
  disabled?: boolean | null, // to match type of Pressable prop
  style?: StyleProp<ViewStyle>
}

const CheckboxShell: React.FC<{
  view: React.ComponentType<CheckboxViewProps>
  checked: boolean,
  setChecked: (b: boolean) => void,
  style?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  view,
  checked,
  setChecked,
  style,
  disabled,
  children,
  ...rest
}) => {

  const [pressed, setPressed] = useState<boolean>(false)

  const CheckboxView = view // must convert the referenced variable to uppercase

  const onPressIn = (e: GestureResponderEvent): void => {
    setPressed(true)
  }

  const onPressOut = (e: GestureResponderEvent): void => {
    setPressed(false)
  }

  const onPress = (e: GestureResponderEvent): void => {
    setChecked(!checked)
  }

    return (
    <Pressable {...rest} {...{onPressIn, onPressOut, onPress, disabled}} >
      <CheckboxView {...{checked, pressed, disabled}} style={style} >
        {children}
      </CheckboxView>
    </Pressable>
  )
} 

export {
  CheckboxShell as default,
  type CheckboxViewProps,
  type CheckboxState
}
