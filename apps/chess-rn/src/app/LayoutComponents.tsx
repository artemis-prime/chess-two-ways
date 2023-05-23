import React, { type PropsWithChildren } from 'react'
import {
  StatusBar,
  View,
  type ViewStyle,
  type ImageStyle,
  type StyleProp,
  type ColorValue
} from 'react-native'

import Animated, { 
  type AnimateStyle,   
  interpolateColor,
  type SharedValue, 
  Extrapolation,
  interpolate
} from 'react-native-reanimated'

import { styled } from '~/style'
import { BGImage, ImageButton } from '~/primatives'

const getLogoButtonAnimStyles = (v: SharedValue<number>): ViewStyle => {
  'worklet';
  return {
    opacity: v.value,
    display: v.value < 0.1 ? 'none' : 'flex'
  }
} 

const LogoButton: React.FC<{
  onClick: () => void
  animatedStyle: AnimateStyle<ViewStyle>
  regStyle?: StyleProp<ViewStyle> // need this method since its animated
  disabled?: boolean
}> = ({
  onClick,
  animatedStyle,
  regStyle,
  disabled = false
}) => (
  <Animated.View 
    style={[animatedStyle, {
      position: 'absolute',
      width: 40,
      height: 40,
      right: 12,
      top: 48 + 12
    }]}
  >
    <ImageButton disabled={disabled} onClick={onClick} 
      style={[regStyle, {
        width: '100%',
        height: '100%'
      }]} 
      stateImages={{
        normal: 'knight_logo_80_normal',
        pressed: 'knight_logo_80_pressed',
        disabled: 'knight_logo_80_disabled'
      }} 
    />
  </Animated.View>
)

const OuterContainer = styled(View, {
  height: '100%', 
  backgroundColor: '$menuBGColor'
})

const GameProperOuter = styled(View, {

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  h: '100%',
  p: '$1',
  pb: 0,
  gap: '$1_5', 
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderColor: '#444',
  borderTopLeftRadius: 0,
  borderWidth: 0,

  variants: {
    showBorder: {
      true: {
        borderTopLeftRadius: '$md',
        borderWidth: '$thicker',
      }
    }
  }
})

const GameBGImage = styled(BGImage, {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: '100%',
})

const OPEN_MENU_Y_OFFSET = 95
const OPEN_MENU_X_FRACTION = 0.65

const getGameContainerAnimStyles = (v: SharedValue<number>, w: number): ViewStyle => {
  'worklet';
  return {
    left: interpolate(
      v.value, 
      [0, 1], 
      [0, (w as number) * OPEN_MENU_X_FRACTION], 
      { extrapolateRight: Extrapolation.CLAMP }
    ),
    top: interpolate(
      v.value, 
      [0, 1], 
      [0, OPEN_MENU_Y_OFFSET], 
      { extrapolateRight: Extrapolation.CLAMP }
    )
  }
}

const GameContainer: React.FC<{
  animatedStyle: AnimateStyle<ViewStyle>
} & PropsWithChildren> = ({
  animatedStyle,
  children 
}) => (
  <Animated.View style={[
    {
      position: 'absolute',
      width: '100%',
      height: '100%',
    }, 
    animatedStyle
  ]}>
    <GameBGImage imageURI={'chess_bg_1920_low_res'}>
      {children}
    </GameBGImage>
  </Animated.View>
)

const getStatusBarSpacerAnimStyles = (v: SharedValue<number>, color: string): ViewStyle => {
  'worklet';
  return {
    backgroundColor: interpolateColor(      
      v.value, 
      [0, 1], 
      ['rgba(0, 0, 0, 0.2)', color ]
    ) as ColorValue 
  }
}

const StatusBarSpacer: React.FC<{
  animatedStyle: AnimateStyle<ViewStyle>
}> = ({
  animatedStyle 
}) => (
  <Animated.View style={[{
    width: '100%', 
    height: StatusBar.currentHeight!,
  }, animatedStyle]} />
)

const getCornerShimAnimStyles = (v: SharedValue<number>): ImageStyle => {
  'worklet';
  return {
    opacity: v.value,
  }
} 

  // Creates the appearance of border radius though only
  // siblings are involved.  Yes, I tried everything else, 
  // believe you me!  Yessiree
const CornerShim: React.FC<{
  animatedStyle: AnimateStyle<ImageStyle>
}> = ({
  animatedStyle
}) => (
  <Animated.Image 
    source={{uri: 'menu_corner_shim_14x14'}} 
    resizeMode='cover'
    style={[
      {
        position: 'absolute',
        width: 7, // half since image was captured at double density (ok for both case)
        height: 7,
        left: 0,
        top: StatusBar.currentHeight!
      },
      animatedStyle
    ]} 
  />
)

export {
  getCornerShimAnimStyles,
  CornerShim,
  GameProperOuter,
  getGameContainerAnimStyles,
  GameContainer,
  getLogoButtonAnimStyles,
  LogoButton,
  GameBGImage,
  OuterContainer,
  getStatusBarSpacerAnimStyles,
  StatusBarSpacer,
}