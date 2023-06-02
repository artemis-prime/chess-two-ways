import React, { type PropsWithChildren } from 'react'
import {
  type ViewStyle,
  type LayoutChangeEvent,
} from 'react-native'

import Animated, { 
  type SharedValue, 
  useAnimatedStyle,
} from 'react-native-reanimated'

import { deborder } from '~/style'
import { Box } from '~/primatives'

import { LogoButton } from './widgets'

const AnimatedLogoButton: React.FC<{
  onClick: () => void
  animBase: SharedValue<number>
}> = ({
  onClick,
  animBase,
}) => (
  <Animated.View style={[
    {
      position: 'absolute',
      width: 40,
      height: 40,
      right: 12,
      top: 48 + 12
    },
    useAnimatedStyle<ViewStyle>(() => ({
      opacity: animBase.value,
      display: animBase.value < 0.1 ? 'none' : 'flex'
    })) 
  ]}>
    <LogoButton onClick={onClick} />
  </Animated.View>
)

const Main: React.FC<{
  toggleMenu: () => void
  animBase: SharedValue<number>
  onLayout: (event: LayoutChangeEvent) => void
} & PropsWithChildren> = ({
  toggleMenu,
  animBase,
  onLayout,
  children
}) => (
  <Box css={{height: '100%', backgroundColor: '$menuBGColor', ...deborder('orange', 'layout')}} onLayout={onLayout}>
    {children}
    <AnimatedLogoButton animBase={animBase} onClick={toggleMenu} />
  </Box>
)

export default Main
