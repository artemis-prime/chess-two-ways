import React, { type PropsWithChildren }  from 'react'
import { 
  Pressable,
  type PressableProps,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Animated, { 
  useSharedValue, 
  Easing, 
  withTiming,
  useDerivedValue,
  useAnimatedStyle,
  interpolateColor,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'

interface TouchFeedbackOptions {
  bgColor?: string[]
  color?: string[]
  duration?: number
  opacity?: number[]
}

interface AnimatedPressableProps {
  feedbackOptions: TouchFeedbackOptions
  style?: StyleProp<ViewStyle>
  setPressed?: (p: boolean) => void
}

const AnimatedPressable: React.FC<
  AnimatedPressableProps
  & Omit<PressableProps, 'onPressIn' | 'onPressOut' | 'children'>
  & PropsWithChildren
> = ({
  style,
  children,
  feedbackOptions,
  setPressed,
  ...rest
}) => {
  
  const pressed = useSharedValue<boolean>(false)

  const animBase = useDerivedValue(() => {
    return withTiming(
      pressed.value ? 1 : 0, 
      { duration : feedbackOptions.duration ?? 50, easing: pressed.value ? Easing.out(Easing.linear) : Easing.in(Easing.linear) },
    )
  }) 
  const onPressIn = (e: GestureResponderEvent): void => { 
    pressed.value = true;
    if (setPressed) {
      setPressed(true)
    } 
  }
  const onPressOut = (e: GestureResponderEvent): void => { 
    pressed.value = false 
    if (setPressed) {
      setPressed(false)
    } 
  }

  const animStyle = useAnimatedStyle<ViewStyle>(() => {
    const result: any = {}
    if (feedbackOptions.color) {
      result.color = interpolateColor(      
        animBase.value, 
        [0, 1], 
        [feedbackOptions.color[0], feedbackOptions.color[1]]
      )
    }
    if (feedbackOptions.bgColor) {
      result.backgroundColor = interpolateColor(      
        animBase.value, 
        [0, 1], 
        [feedbackOptions.bgColor[0], feedbackOptions.bgColor[1]]
      )
    }
    if (feedbackOptions.opacity) {
      result.opacity = interpolate(      
        animBase.value, 
        [0, 1], 
        [feedbackOptions.opacity[0], feedbackOptions.opacity[1]],
        { extrapolateRight: Extrapolation.CLAMP }
      )
    }
    return result as ViewStyle
  })

  const styleArray: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>> = 
    (Array.isArray(style)) ? [...style, animStyle] : [style, animStyle]

  return ( 
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} {...rest}>
      <Animated.View style={styleArray}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

export {
  AnimatedPressable as default,
  type TouchFeedbackOptions,
  type AnimatedPressableProps
}
