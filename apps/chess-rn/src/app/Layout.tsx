import React, { useRef, useEffect } from 'react'
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  ViewStyle
} from 'react-native'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'

import {
  Gesture,
  Directions,
} from 'react-native-gesture-handler'

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  Easing, 
  withTiming,
  interpolate,
  Extrapolation,  
  runOnJS,
  AnimateStyle
 } from 'react-native-reanimated'

import { useTheme } from '~/styles/stitches.config'
import { useUI } from '~/services'

import Board from './Board'
import Dash from './Dash'

import {
  OuterContainer,
  GameAreaView,
  StatusBarSpacer,
  CornerShim,
  GameBGImage
} from './LayoutComponents'

  //https://reactnative.dev/docs/dimensions
const screenDimensions = Dimensions.get('screen')

const OPEN_MENU_Y_OFFSET = 92
const OPEN_MENU_X_FRACTION = 0.6

const Layout: React.FC = observer(() => {

  const widthRef = useRef<number>(screenDimensions.width)
  const theme = useTheme()
  const ui = useUI()

    // 0 <--> 1, styles are interpolated as needed
  const menuAnimation = useSharedValue<number>(0) 

    // Designed to be safely shared by both threads.
    // mobx observables, being proxied get flagged 
    // and an Error is thrown. 
  const menuVisibleShared = useSharedValue<boolean>(false) 
    
    // Keep them in sync.  We'll read and mutate
    // the mobx one only on this thread,
    // and then only read the shared verion on the UI thread
  autorun(() => { menuVisibleShared.value = ui.menuVisible })

    //https://reactnative.dev/docs/dimensions
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change',
      ({screen}) => { widthRef.current = screen.width },
    )
    return () => {subscription?.remove()}
  })
  
  const setMenuVisible = (open: boolean): void => { ui.setMenuVisible(open) }

  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .onStart((e) => {
      menuAnimation.value = withTiming(
        menuVisibleShared.value ? 0 : 1, 
        {
          duration: 200,
          easing: menuVisibleShared.value ? Easing.out(Easing.exp) : Easing.in(Easing.exp),
        },
        () => {
          // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS/
          // Reading from / mutating a mobx observable 
          // is not allowed on the UI thread.
          runOnJS(setMenuVisible)(!menuVisibleShared.value)
        }
      )
    })

  const regularGameContainerStyles = {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.headerBG,
  } as AnimateStyle<ViewStyle> 

  const animatedGameContainerStyles = useAnimatedStyle(() => {
    const translateX = interpolate(
      menuAnimation.value, 
      [0, 1], 
      [0, widthRef.current  * OPEN_MENU_X_FRACTION], 
      { extrapolateRight: Extrapolation.CLAMP }
    )
    const translateY = interpolate(
      menuAnimation.value, 
      [0, 1], 
      [0, OPEN_MENU_Y_OFFSET], 
      { extrapolateRight: Extrapolation.CLAMP }
    )
    return { transform: [{ translateX }, { translateY }] }
  })

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <OuterContainer>
        <Animated.View style={[ regularGameContainerStyles, animatedGameContainerStyles ]}>
          <GameBGImage imageURI={'chess_bg_1920'} >
            {/* pseudo margin element... best way to achieve the desired animation effect */}
            <StatusBarSpacer menuVisible={ui.menuVisible} />
            <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
            {ui.menuVisible && <CornerShim left={0} top={StatusBar.currentHeight!} /> }
            <GameAreaView showBorder={ui.menuVisible}>
              <Dash menuHandleProps={{menuVisible: ui.menuVisible, gesture}} />
              <Board />
            </GameAreaView>
          </GameBGImage>
        </Animated.View>
      </OuterContainer>
    </SafeAreaView>
  )
})

export default Layout
