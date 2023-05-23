import React, { 
  useRef, 
  useEffect, 
  useState, 
} from 'react'
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
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
  Easing, 
  withTiming,
  runOnJS,
  runOnUI,
 } from 'react-native-reanimated'

import { useTheme, useAnimatedStyleExt } from '~/style'
import { useMenu } from '~/services'

import Chessboard from './Chessboard'
import Chalkboard from './Chalkboard'
import Menu, { getMenuAnimStyles } from './Menu'

import {
  getCornerShimAnimStyles,
  CornerShim,
  GameProperOuter,
  getGameContainerAnimStyles,
  GameContainer,
  LogoButton,
  getLogoButtonAnimStyles,
  OuterContainer,
  getStatusBarSpacerAnimStyles,
  StatusBarSpacer,

} from './LayoutComponents'

const screenDimensions = Dimensions.get('screen')

const OPEN_MENU_X_FRACTION = 0.65

const GameProper: React.FC<{
  gesture: FlingGesture
  showBorder: boolean 
}> = observer(({
  gesture,
  showBorder
}) => {
  const ui = useMenu()
  const theme = useTheme()
  return (
      // This must be an animated view AND IN THIS FILE
      // due to what seems to be a r-n-reanimated bug.
    <GameProperOuter showBorder={showBorder}>
      <Animated.View collapsable={false} style={{gap: theme.space['1_5']}}>
        <Chalkboard disableInput={ui.menuVisible} menuVisible={ui.menuVisible} gesture={gesture} />
        <Chessboard disableInput={ui.menuVisible} />
      </Animated.View>
    </GameProperOuter >
  )
})

const App: React.FC = () => {

  const sizeRef = useRef<{w: number, h: number}>({w: screenDimensions.width, h: screenDimensions.height})
  const theme = useTheme()
  const ui = useMenu()

    // Can be referenced on both threads.
    // Mobx observables on the other, being proxied, get flagged 
    // and an Error is thrown (Since they are proxied object)
  const menuVisible = useSharedValue<boolean>(ui.menuVisible) 

    // 0 <--> 1: default state <--> menu visible 
    // Animated styles are interpolated as needed.
    // ui.menuVisible is mutated at the END of the animation.
  const animBase = useSharedValue<number>(menuVisible.value ? 1 : 0) 

    // Needs to change at slightly different times then ui.menuVisible
  const [menuFullyVisible, setMenuFullyVisible] = useState<boolean>(menuVisible.value)

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change',
      ({screen}) => { sizeRef.current = {w: screen.width, h: screen.height }},
    )
    return () => { subscription.remove() }
  }, [])

    const onAnimationStarted = (): void => {
    if (menuVisible.value) { setMenuFullyVisible(false) }
  }

  const onAnimationFinished = (openned: boolean): void => { 
     if (openned) {
      setMenuFullyVisible(true)  
    }
    menuVisible.value = openned
    ui.setMenuVisible(openned) 
  }

  const closeMenu = () => { runOnUI(triggerAnimation)(null) }

    // Sometimes this is called from a click. 
    // Sometimes as onStart() of a drag gesture, 
    // which means it's on the UI thread.
    // We have to designate it as a 'worklet'; 
  const triggerAnimation = (e: GestureStateChangeEvent<FlingGestureHandlerEventPayload> | null) => {
    'worklet';
    runOnJS(onAnimationStarted)()
    animBase.value = withTiming(
      menuVisible.value ? 0 : 1, 
      {
        duration: 200,
        easing: menuVisible.value ? Easing.out(Easing.linear) : Easing.in(Easing.linear),
      },
      () => {
        // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS/
        // mobx observables (and any proxy objects) get clobbered when transfered onto the UI thread.
        runOnJS(onAnimationFinished)(!menuVisible.value)
      }
    )
  }

  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .onStart(triggerAnimation)

  const animatedGameContainer = 
    useAnimatedStyleExt<number, ViewStyle>(animBase, getGameContainerAnimStyles, [sizeRef.current.w])

  const animatedStatusBarSpacer = 
    useAnimatedStyleExt<number, ViewStyle>(animBase, getStatusBarSpacerAnimStyles, [theme.colors.menuBGColor])

  const animatedCornerShim = 
    useAnimatedStyleExt<number, ImageStyle>(animBase, getCornerShimAnimStyles)

  const animatedMenu = 
    useAnimatedStyleExt<number, ViewStyle>(animBase, getMenuAnimStyles)

  const animatedLogoButton = 
    useAnimatedStyleExt<number, ViewStyle>(animBase, getLogoButtonAnimStyles)

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
      <OuterContainer>
        <Menu animatedStyle={animatedMenu} width={sizeRef.current.w  * OPEN_MENU_X_FRACTION}/>
        <GameContainer animatedStyle={animatedGameContainer}>
          <StatusBarSpacer animatedStyle={animatedStatusBarSpacer} />
          <CornerShim animatedStyle={animatedCornerShim} />
          <GameProper showBorder={menuFullyVisible} gesture={gesture} />
        </GameContainer>
        <LogoButton animatedStyle={animatedLogoButton} onClick={closeMenu} />
      </OuterContainer>
    </SafeAreaView>
  )
}

export default App
