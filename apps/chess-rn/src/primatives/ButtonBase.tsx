import React, { useState, type PropsWithChildren }  from 'react'
import { 
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { type CSS } from '~/style'

import AnimatedPressable, { type ViewPropAnimation }  from './AnimatedPressable'

interface ButtonViewProps extends PropsWithChildren {
  on?: boolean
  pressed?: boolean
  disabled?: boolean 
  menu? : boolean
  chalkboard?: boolean
  css? : CSS,
  style?: StyleProp<ViewStyle>
}

const ButtonBase: React.FC<{
  view?: React.ComponentType<ButtonViewProps>
  animations: ViewPropAnimation[]
    // If 'on' is provided, this will
    // be called with the value toggled 
  onClick: ((on: boolean) => void) | (() => void) 
  containerStyle?: StyleProp<ViewStyle> 
  on?: boolean
  disabled?: boolean
  viewCss?: CSS
  viewStyle?: StyleProp<ViewStyle>
  viewProps?: {[key in string]: any}
} & PropsWithChildren> = ({
  view,
  animations,
  onClick,
  containerStyle,
  on,
  disabled,
  children, 
  viewCss,
  viewStyle,
  viewProps
}) => {

  const ButtonView = view // must convert the referenced variable to uppercase
  const [pressed, setPressed] = useState<boolean>(false)

  const onPress = (ignore: GestureResponderEvent) => {
    if (on === undefined) {
      (onClick as () => void)()
    }
    else {
      (onClick as (b: boolean) => void)(!on)  
    }
  }

  return (
    <AnimatedPressable
      style={containerStyle ?? {}}
      disabled={disabled}
      animations={animations}
      setPressed={setPressed}
      onPress={onPress}
    >
    {ButtonView ? (
      <ButtonView 
        pressed={pressed} 
        on={on} 
        disabled={disabled} 
        css={viewCss}
        style={viewStyle}
        {...viewProps}
      >
        {children}
      </ButtonView>
    ) : (
      children
    )}
    </AnimatedPressable>
  )
}

export {
  ButtonBase as default,
  type ButtonViewProps
}