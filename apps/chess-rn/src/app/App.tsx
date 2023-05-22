import React, { 
  useRef, 
  useEffect, 
  useState 
} from 'react'
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  type StyleProp,
  type ViewStyle,
  type ImageStyle,
} from 'react-native'
import { observer } from 'mobx-react-lite'

import {
  Gesture,
  Directions,
  type FlingGesture,
  type GestureStateChangeEvent,
  type FlingGestureHandlerEventPayload,
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
  runOnUI,
 } from 'react-native-reanimated'

import { useTheme } from '~/style'

import { useMenu } from '~/services'

import Board from './Board'
import Dash from './Dash'

import {
  CornerShim,
  GameAreaOuter,
  GameBGImage,
  GameContainer,
  LogoButton,
  OuterContainer,
  StatusBarSpacer,
} from './LayoutComponents'

import Menu from './Menu'

const screenDimensions = Dimensions.get('screen')

const OPEN_MENU_Y_OFFSET = 95
const OPEN_MENU_X_FRACTION = 0.65

const GameArea: React.FC<{
  gesture: FlingGesture 
}> = observer(({
  gesture
}) => {
  const ui = useMenu()
  return (
      // This must be an animated view due to what seems to be a
      // r-n-reanimated bug.
    <Animated.View collapsable={false} style={{gap: 11}}>
      <Dash disableInput={ui.menuVisible} menuVisible={ui.menuVisible} gesture={gesture} />
      <Board disableInput={ui.menuVisible} />
    </Animated.View>
  )
})

const App: React.FC = () => {

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
    // Sometimes this is called from a click. 
    // Sometimes as onStart() of a drag gesture, 
    // which means it's on the UI thread.
    // We have to designate it as a 'worklet'; 
  const triggerAnimation = (e: GestureStateChangeEvent<FlingGestureHandlerEventPayload> | null) => {
    'worklet';
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
  }

  const closeMenu = () => {
    runOnUI(triggerAnimation)(null)
  }

  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .onStart(triggerAnimation)

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

  const animatedOpacity = useAnimatedStyle<AnimateStyle<ViewStyle>>(() => ({
    opacity: menuAnimationBase.value
  }))

  const animatedLogoButton = useAnimatedStyle<AnimateStyle<ViewStyle>>(() => ({
    opacity: menuAnimationBase.value,
    display: menuAnimationBase.value < 0.1 ? 'none' : 'flex'
  }))

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
      <OuterContainer>
        <Menu animatedStyle={animatedOpacity} width={sizeRef.current.w  * OPEN_MENU_X_FRACTION}/>
        <GameContainer animatedStyle={gameContainerAnimatedStyle}>
          <GameBGImage imageURI={'chess_bg_1920_low_res'} >
            <StatusBarSpacer animatedStyle={statusBarSpacerAnimatedStyle} />
            <CornerShim animatedStyle={shimAnimatedStyle} />
            <GameAreaOuter showBorder={menuFullyVisible}>
              <GameArea gesture={gesture} />
            </GameAreaOuter>
          </GameBGImage>
        </GameContainer>
        <LogoButton animatedStyle={animatedLogoButton} onClick={closeMenu} />
      </OuterContainer>
    </SafeAreaView>
  )
}

export default App
