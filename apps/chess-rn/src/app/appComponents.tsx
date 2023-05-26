import React, { type PropsWithChildren } from 'react'
import {
  StatusBar,
  type ViewStyle,
  type ImageStyle,
} from 'react-native'
import { observer } from 'mobx-react-lite'

import Animated, { 
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue, 
  useAnimatedStyle
} from 'react-native-reanimated'

import { useTheme, layout } from '~/style'
import { BGImage, Box } from '~/primatives'
import { useMenu } from '~/services'

import Chalkboard from './Chalkboard'
import Chessboard from './Chessboard'
import { LogoButton } from './widgets'

const Main: React.FC<{
  toggleMenu: () => void
  animBase: SharedValue<number>
} & PropsWithChildren> = ({
  toggleMenu,
  animBase,
  children
}) => (
  <Box css={{height: '100%', backgroundColor: '$menuBGColor'}}>
    {children}
    <AnimatedLogoButton animBase={animBase} onClick={toggleMenu} />
  </Box>
)

const Game: React.FC<{
  toggleMenu: () => void
  animBase: SharedValue<number>
  width: number
}> = ({
  toggleMenu,
  animBase,
  width,
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
          [0, width * layout.portrait.openMenu.xFraction], 
          { extrapolateRight: Extrapolation.CLAMP }
        ),
        top: interpolate(
          animBase.value, 
          [0, 1], 
          [0, layout.portrait.openMenu.yOffset], 
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
      <StatusBarSpacer animBase={animBase} />
      <CornerShim animBase={animBase} />
      <GameProper animBase={animBase} toggleMenu={toggleMenu} />
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
    // Size is half the resolution since image was captured at double density/
    // (ok for both case)
  <Animated.Image 
    source={{uri: 'menu_corner_shim_14x14'}} 
    resizeMode='cover'
    style={[
      {
        position: 'absolute',
        width: 7, 
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

const GameProper: React.FC<{
  animBase: SharedValue<number>
  toggleMenu: () => void
}> = observer(({
  animBase,
  toggleMenu,
}) => {
  const theme = useTheme()
  const ui = useMenu()
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
      <Chalkboard 
        disableInput={ui.menuVisible} 
        menuVisible={ui.menuVisible} 
        toggleMenu={toggleMenu} 
        animBaseForButton={animBase}
      />
      <Chessboard disableInput={ui.menuVisible} />
    </Animated.View>
  )
})

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

export {
  Main,
  Game
}
