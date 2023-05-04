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
import { autorun } from 'mobx'

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
import { useUI } from '~/services'

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

//import Menu, { MenuTitle } from './Menu'

const screenDimensions = Dimensions.get('screen')

const OPEN_MENU_Y_OFFSET = 92
const OPEN_MENU_X_FRACTION = 0.6

const GameAreaInner: React.FC<{
  gesture: FlingGesture 
}> = ({
  gesture
}) => {

  const ui = useUI()
  const [menuVisible, setMenuVisible] = useState<boolean>(ui.menuVisible)

  useEffect(() => {
    return autorun(() => {
      setMenuVisible(ui.menuVisible)
    })
  }, [])

  return (<>
    <Dash disableInput={menuVisible} menuVisible={menuVisible} gesture={gesture} />
    <Board disableInput={menuVisible} />
  </>)
}

const GameAreaInnerOuter: React.FC<{
  gesture: FlingGesture 
}> = ({
  gesture
}) => (
  <Animated.View collapsable={false} style={{gap: 11}}>
    <GameAreaInner gesture={gesture}/>
  </Animated.View>
)
  

const Layout: React.FC = () => {

  const sizeRef = useRef<{w: number, h: number}>({w: screenDimensions.width, h: screenDimensions.height})
  const theme = useTheme()
  const ui = useUI()

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

  const onAnimationStarted = (): void => {
    if (menuVisible_sv.value) {
      setMenuFullyVisible(false)   
    }
  }

  const _setMenuVisible = (visible: boolean): void => { 
     if (visible) {
      setMenuFullyVisible(true)  
    }
    menuVisible_sv.value = visible
    ui.setMenuVisible(visible) 
  }
  
  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .onStart((e) => {
      runOnJS(onAnimationStarted)()
      menuAnimationBase.value = withTiming(
        menuVisible_sv.value ? 0 : 1, 
        {
          duration: 200,
          easing: menuVisible_sv.value ? Easing.out(Easing.linear) : Easing.in(Easing.linear),
        },
        () => {
          // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS/
          // Accessing mobx observables is not allowed on the UI thread.
          runOnJS(_setMenuVisible)(!menuVisible_sv.value)
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

  const cornerShimAnimatedStyle = useAnimatedStyle<AnimateStyle<ImageStyle>>(() => ({
    opacity: menuAnimationBase.value
  }))

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
      <OuterContainer>
        <GameContainer animatedStyle={gameContainerAnimatedStyle}>
          <GameBGImage imageURI={'chess_bg_1920_low_res'} >
            <StatusBarSpacer animatedStyle={statusBarSpacerAnimatedStyle} />
            <CornerShim animatedStyle={cornerShimAnimatedStyle} />
            <GameArea showBorder={menuFullyVisible}>
              <GameAreaInnerOuter gesture={gesture} />
            </GameArea>
          </GameBGImage>
        </GameContainer>
      </OuterContainer>
    </SafeAreaView>
  )
}

export default Layout
