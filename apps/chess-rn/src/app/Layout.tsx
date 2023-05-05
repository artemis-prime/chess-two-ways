import React, { 
  useRef, 
  useEffect, 
  useState 
} from 'react'
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  type ViewStyle,
  type ImageStyle,
} from 'react-native'
import { observer } from 'mobx-react'

import {
  Gesture,
  Directions,
  type FlingGesture,
} from 'react-native-gesture-handler'

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  Easing, 
  withTiming,
  interpolate,
  Extrapolation,  
  runOnJS,
  type AnimateStyle,
  interpolateColor,
 } from 'react-native-reanimated'

import { useTheme } from '~/styles/stitches.config'
import { useMenu } from '~/services'

import Board from './Board'
import Dash from './Dash'

import {
  OuterContainer,
  GameArea,
  GameContainer,
  StatusBarSpacer,
  CornerShim,
  GameBGImage
} from './LayoutComponents'

import Menu from './Menu'

const screenDimensions = Dimensions.get('screen')

const OPEN_MENU_Y_OFFSET = 95
const OPEN_MENU_X_FRACTION = 0.65

const GameAreaInnermost: React.FC<{
  gesture: FlingGesture 
}> = observer(({
  gesture
}) => {

  const ui = useMenu()

  return (<>
    <Dash disableInput={ui.menuVisible} menuVisible={ui.menuVisible} gesture={gesture} />
    <Board disableInput={ui.menuVisible} />
  </>)
})

const GameAreaInner: React.FC<{
  gesture: FlingGesture 
}> = ({
  gesture
}) => (
    // This must be an animated view due to what seems to be a
    // r-n-reanimated bug.
  <Animated.View collapsable={false} style={{gap: 11}}>
    <GameAreaInnermost gesture={gesture}/>
  </Animated.View>
)

const Layout: React.FC = () => {

  const sizeRef = useRef<{w: number, h: number}>({w: screenDimensions.width, h: screenDimensions.height})
  const theme = useTheme()
  const ui = useMenu()

    // Can be referenced on both threads.
    // Mobx observables on the other, being proxied, get flagged 
    // and an Error is thrown (Since they are proxied object)
  const menuVisible_sv = useSharedValue<boolean>(ui.menuVisible) 

    // 0 <--> 1: default state <--> menu visible 
    // Animated styles are interpolated as needed.
    // ui.menuVisible is mutated at the END of the animation.
  const menuAnimationBase = useSharedValue<number>(menuVisible_sv.value ? 1 : 0) 

    // Needs to change at slightly different times then ui.menuVisible
  const [menuFullyVisible, setMenuFullyVisible] = useState<boolean>(menuVisible_sv.value)

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change',
      ({screen}) => { sizeRef.current = {w: screen.width, h: screen.height }},
    )
    return () => { subscription?.remove() }
  }, [])

  const onMenuAnimationStarted = (): void => {
    if (menuVisible_sv.value) {
      setMenuFullyVisible(false)   
    }
  }

  const onMenuAnimationFinished = (openned: boolean): void => { 
     if (openned) {
      setMenuFullyVisible(true)  
    }
    menuVisible_sv.value = openned
    ui.setMenuVisible(openned) 
  }
  
  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .onStart((e) => {
      runOnJS(onMenuAnimationStarted)()
      menuAnimationBase.value = withTiming(
        menuVisible_sv.value ? 0 : 1, 
        {
          duration: 200,
          easing: menuVisible_sv.value ? Easing.out(Easing.linear) : Easing.in(Easing.linear),
        },
          // on finish
        () => {
          // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS/
          // mobx observables (and any proxy objects) get clobbered when transfered onto the UI thread.
          runOnJS(onMenuAnimationFinished)(!menuVisible_sv.value)
        }
      )
    })

  const gameContainerAnimatedStyle = useAnimatedStyle<AnimateStyle<ViewStyle>>(() => ({
    left: interpolate(
      menuAnimationBase.value, 
      [0, 1], 
      [0, sizeRef.current.w  * OPEN_MENU_X_FRACTION], 
      { extrapolateRight: Extrapolation.CLAMP }
    ),
    top: interpolate(
      menuAnimationBase.value, 
      [0, 1], 
      [0, OPEN_MENU_Y_OFFSET], 
      { extrapolateRight: Extrapolation.CLAMP }
    )
  }), [sizeRef.current.w])

  const statusBarSpacerAnimatedStyle = useAnimatedStyle<AnimateStyle<ViewStyle>>(() => ({
    backgroundColor: interpolateColor(      
      menuAnimationBase.value, 
      [0, 1], 
      ['rgba(0, 0, 0, 0.2)', theme.colors.headerBG]
    ) 
  }))

  const shimAnimatedStyle = useAnimatedStyle<AnimateStyle<ImageStyle>>(() => ({
    opacity: menuAnimationBase.value
  }))

  const menuAnimatedStyle = useAnimatedStyle<AnimateStyle<ViewStyle>>(() => ({
    opacity: menuAnimationBase.value
  }))

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
      <OuterContainer>
        <Menu animatedStyle={menuAnimatedStyle} width={sizeRef.current.w  * OPEN_MENU_X_FRACTION}/>
        <GameContainer animatedStyle={gameContainerAnimatedStyle}>
          <GameBGImage imageURI={'chess_bg_1920_low_res'} >
            <StatusBarSpacer animatedStyle={statusBarSpacerAnimatedStyle} />
            <CornerShim animatedStyle={shimAnimatedStyle} />
            <GameArea showBorder={menuFullyVisible}>
              <GameAreaInner gesture={gesture} />
            </GameArea>
          </GameBGImage>
        </GameContainer>
      </OuterContainer>
    </SafeAreaView>
  )
}

export default Layout
