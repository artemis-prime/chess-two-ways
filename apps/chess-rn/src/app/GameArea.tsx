import React from 'react'
import { type ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'

import Animated, { 
  Extrapolation,
  interpolate,
  type SharedValue, 
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated'

import { useTheme, deborder } from '~/style'
import { useChalkboard, useMenu, useViewport } from '~/services'

import Chalkboard from './Chalkboard'
import Chessboard from './Chessboard'

const GameArea: React.FC<{
  animBase: SharedValue<number>
  toggleMenu: () => void
}> = observer(({
  animBase : menuAnimBase,
  toggleMenu,
}) => {
  const theme = useTheme()
  const menu = useMenu()
  const cb = useChalkboard()

  const cbAnimBase = useSharedValue<number>(cb.open ? 1 : 0) 

    // state changes at the end of the animiation
  const animate = (opening: boolean) => {
    const onFinished = () => { cb.setOpen(opening) }
    cbAnimBase.value = withTiming(
      opening ? 1 : 0,
      {
        duration: 200,  
        easing: opening ? Easing.out(Easing.linear) : Easing.in(Easing.linear) 
      },
      () => { runOnJS(onFinished)() }
    )
  }

  const setOpen = (b: boolean) => { animate(b) }

  return (
    <Animated.View style={[
      {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        padding: theme.space[1],
        paddingBottom: 65,
        gap: theme.space['1_5'], 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: '#444',
      }, 
      useAnimatedStyle<ViewStyle>(
        () => ({
          borderTopLeftRadius: interpolate(
            menuAnimBase.value, 
            [0, 1], 
            [0, theme.radii.md], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
          borderWidth: interpolate(
            menuAnimBase.value, 
            [0, 1], 
            [0, theme.borderWidths.thicker], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
        }) 
      )
    ]}>
      <Animated.View 
        collapsable={false} 
        style={[
          {
            ...deborder('yellow', 'layout'),
            minHeight: 100,
            flexBasis: 100,
            flexShrink: 0,
          },
          useAnimatedStyle(() => ({
            flexGrow: cbAnimBase.value,
          }))
          ]}
        >
          <Chalkboard 
            disableInput={menu.visible} 
            visible={menu.visible} 
            toggleMenu={toggleMenu} 
            animBaseForButton={menuAnimBase}
            open={cb.open}
            setOpen={setOpen}
            css={{ position: 'absolute', t: 0, b: 0, r: 0, l: 0 }}
          />
      </Animated.View>
      <Chessboard css={{flexGrow: 0, flexShrink: 0 }} disableInput={menu.visible} />
    </Animated.View>
  )
})

export default GameArea
