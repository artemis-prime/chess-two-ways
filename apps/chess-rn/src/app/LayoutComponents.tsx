import React, { type PropsWithChildren } from 'react'
import {
  StatusBar,
  View,
  type ViewStyle,
  type ImageStyle,
  type StyleProp
} from 'react-native'

import Animated, { type AnimateStyle } from 'react-native-reanimated'

import { styled, useTheme } from '~/style'
import { BGImage, ImageButton } from '~/primatives'


const LogoButton: React.FC<{
  onClick: () => void
  animatedStyle: AnimateStyle<ViewStyle>
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}> = ({
  onClick,
  animatedStyle,
  style,
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
      style={[style, {
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
  backgroundColor: '$headerBG'
})

const GameAreaOuter: React.FC<{
  showBorder: boolean
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  showBorder, 
  children,
  style
}) => {

  const theme = useTheme()

  return (
    <View style={[{
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      height: '100%',
      paddingLeft: theme.space.single,
      paddingRight: theme.space.single,
      paddingTop: theme.space.single,
      paddingBottom: 0,
      gap: 11, 
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: '#444',
      borderTopLeftRadius: showBorder ? theme.radii.md : 0,
      borderWidth: showBorder ? 2 : 0,
    }, style]}>
      {children}
    </View> 
  )
}

const GameContainer: React.FC<{
  animatedStyle: AnimateStyle<ViewStyle>
} & PropsWithChildren> = ({
  animatedStyle,
  children 
}) => {
  const theme = useTheme()

  return (
    <Animated.View style={[{
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.headerBG,
    }, animatedStyle
    ]}>
      {children}
    </Animated.View>
  )
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

const GameBGImage = styled(BGImage, {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: '100%',
})

export {
  CornerShim,
  GameAreaOuter,
  GameBGImage,
  GameContainer,
  LogoButton,
  OuterContainer,
  StatusBarSpacer,
}