import React, { type PropsWithChildren } from 'react'
import {
  StatusBar,
  View,
  type ViewStyle,
  type ImageStyle,
  type StyleProp,
} from 'react-native'

import Animated, { 
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue, 
  useAnimatedStyle
} from 'react-native-reanimated'

import { styled, useTheme } from '~/style'
import { BGImage, ImageButton } from '~/primatives'
import { observer } from 'mobx-react-lite'
import { useMenu } from '~/services'
import Chalkboard from './Chalkboard'
import Chessboard from './Chessboard'

const LogoButton: React.FC<{
  onClick: () => void
  animBase: SharedValue<number>
  style?: StyleProp<ViewStyle> 
  disabled?: boolean
}> = ({
  onClick,
  animBase,
  style,
  disabled = false
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
  backgroundColor: '$menuBGColor'
})


  // TODO
const OPEN_MENU_Y_OFFSET = 95
const OPEN_MENU_X_FRACTION = 0.65

const GameContainer: React.FC<{
  animBase: SharedValue<number>
  width: number
} & PropsWithChildren> = ({
  animBase,
  width,
  children 
}) => (

  <Animated.View style={[
    {
      position: 'absolute',
      width: '100%',
      height: '100%',
    }, 
    useAnimatedStyle<ViewStyle>(
      () => ({
        left: interpolate(
          animBase.value, 
          [0, 1], 
          [0, width * OPEN_MENU_X_FRACTION], 
          { extrapolateRight: Extrapolation.CLAMP }
        ),
        top: interpolate(
          animBase.value, 
          [0, 1], 
          [0, OPEN_MENU_Y_OFFSET], 
          { extrapolateRight: Extrapolation.CLAMP }
        )
      }), 
      [width]
    )
  ]}>
    <BGImage imageURI={'chess_bg_1920_low_res'} style={{
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      height: '100%',
    }}>
      {children}
    </BGImage>
  </Animated.View>
)

const StatusBarSpacer: React.FC<{
  animBase: SharedValue<number>
}> = ({
  animBase 
}) => {
  const theme = useTheme()
  return (
    <Animated.View style={[
      {
        width: '100%', 
        height: StatusBar.currentHeight!,
      }, 
      useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(      
          animBase.value, 
          [0, 1], 
          ['rgba(0, 0, 0, 0.2)', theme.colors.menuBGColor ]
        )
      }))
    ]}/>
  )
}

  // Creates the appearance of border radius though only
  // siblings are involved.  Yes, I tried everything else, 
  // believe you me!  Yessiree
const CornerShim: React.FC<{
  animBase: SharedValue<number>
}> = ({
  animBase  
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
      useAnimatedStyle<ImageStyle>(() => ({
        opacity: animBase.value
      }))
    ]} 
  />
)

const GameOuter: React.FC<{
  animBase: SharedValue<number>
} & PropsWithChildren> = ({
  animBase,
  children
}) => {
  const theme = useTheme()
  return (
    <Animated.View style={[
      {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        padding: theme.space[1],
        paddingBottom: 0,
        gap: theme.space['1_5'], 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: '#444',
      }, 
      useAnimatedStyle<ViewStyle>(
        () => ({
          borderTopLeftRadius: interpolate(
            animBase.value, 
            [0, 1], 
            [0, theme.radii.md], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
          borderWidth: interpolate(
            animBase.value, 
            [0, 1], 
            [0, theme.borderWidths.thicker], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
        }) 
      )
    ]}>
      {children}
    </Animated.View>
  )
}

const Game: React.FC<{
  toggleMenu: () => void
  animBase: SharedValue<number>
}> = observer(({
  toggleMenu,
  animBase
}) => {
  const ui = useMenu()
  return (
      // There must be an animated view IN THIS FILE
      // due to what seems to be a subtle r-n-reanimated bug.
    <GameOuter animBase={animBase}>
      <Chalkboard disableInput={ui.menuVisible} menuVisible={ui.menuVisible} toggleMenu={toggleMenu} />
      <Chessboard disableInput={ui.menuVisible} />
    </GameOuter >
  )
})

export {
  CornerShim,
  GameContainer,
  LogoButton,
  OuterContainer,
  StatusBarSpacer,
  Game
}
