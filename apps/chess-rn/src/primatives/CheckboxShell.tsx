import React, { PropsWithChildren, useState } from 'react'
import { 
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'

type CheckboxState = 'checked' | 'unchecked' | 'pressed' | 'disabled'

interface CheckboxViewProps extends PropsWithChildren {
  state: CheckboxState
  style?: StyleProp<ViewStyle>
}

const CheckboxShell: React.FC<{
  view: React.ComponentType<CheckboxViewProps>
  checked: boolean,
  setChecked: (b: boolean) => void,
  viewStyle?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  view,
  checked,
  setChecked,
  viewStyle,
  disabled,
  children,
  ...rest
}) => {

  const [checkboxState, setCheckboxState] = useState<CheckboxState>('unchecked')

  const CheckboxView = view // must convert the referenced variable to uppercase

  const onPressIn = (e: GestureResponderEvent): void => {
    setCheckboxState('pressed')
  }

  const onPressOut = (e: GestureResponderEvent): void => {
    setCheckboxState(checked ? 'checked' : 'unchecked')
  }

  const onPress = (e: GestureResponderEvent): void => {
    setChecked(!checked)
  }

  return (
    <Pressable {...rest} {...{onPressIn, onPressOut, onPress, disabled}} >
      <CheckboxView state={disabled ? 'disabled' : checkboxState} style={viewStyle} >
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
