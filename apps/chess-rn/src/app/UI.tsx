import React, { useRef, useEffect } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  View,
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

import { styled, useTheme } from '~/style/stitches.config'
import { useUI } from '~/service'
import { BGImage } from '~/primatives'

import Board from './Board'
import Dash from './Dash'
import MenuFlingHandle from './MenuFlingHandle'

  //https://reactnative.dev/docs/dimensions
const screenDimensions = Dimensions.get('screen')

const OPEN_MENU_Y_OFFSET = 120
const OPEN_MENU_X_FRACTION = 0.6

const OuterContainer = styled(View, {
  height: '100%', 
  backgroundColor: '$headerBG'
})

const GameAreaView = styled(View, {

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  h: '100%',
  pl: '$2',
  pr: '$2',
  pt: '$2',
  pb: 0,
  gap: 11, // bug? Doesn't seem to recognize size token values.
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  
  variants: {
    showBorder: {
      false: {},
      true: {
        borderColor: '#444',
        borderTopLeftRadius: '$md',
        borderWidth: 2,
      }
    }
  }
})

const StatusBarSpacer = styled(View, {
  width: '100%', 
  height: StatusBar.currentHeight!,
  variants: {
    menuVisible: {
      true: {
        backgroundColor: '$headerBG'
      },
      false: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)' // to match the rest of the app area  
      }
    }
  } 
})

  // Creates the appearance of border radius though only
  // siblings are involved.  Yes, I tried everything else, 
  // believe you me!  Yessiree
const CornerShim: React.FC<{
  left: number,
  top: number
}> = ({
  left,
  top
}) => (
  <Image 
    source={{uri: 'menu_corner_shim_14x14'}} 
    resizeMode='cover'
    style={{
      position: 'absolute',
      width: 7, // half since image was captured at double density (ok for both case)
      height: 7,
      left,
      top,
    }} 
  />
)

const GameBGImage = styled(BGImage, {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: '100%',
})

const UI: React.FC = observer(() => {

  const widthRef = useRef<number>(screenDimensions.width)
  const theme = useTheme()
  const ui = useUI()

    // 0 <--> 1, styles are interpolated as needed
  const menuAnimation = useSharedValue(0) 
  const menuVisibleProxy = useSharedValue(false) // can be used on both threads

  autorun(() => {
    menuVisibleProxy.value = ui.menuVisible // keep values in sync
  })

    //https://reactnative.dev/docs/dimensions
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change',
      ({screen}) => { widthRef.current = screen.width },
    )
    return () => {subscription?.remove()}
  })
  
  const onMenuAnimationDone = (open: boolean): void => { ui.setMenuVisible(open) }

  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .runOnJS(true)
    .onBegin((e) => {
    })
    .onStart((e) => {
      menuAnimation.value = withTiming(
        menuVisibleProxy.value ? 0 : 1, 
        {
          duration: 200,
          easing: menuVisibleProxy.value ? Easing.out(Easing.exp) : Easing.in(Easing.exp),
        },
        () => {
          // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS/
          // Calling a mobx store or modifying a React ref is not allowed on the UI thread.
          // We could have used a SharedValue, but this is simpler.
          runOnJS(onMenuAnimationDone)(!menuVisibleProxy.value)
        }
      )
    })

  const regularGameContainerStyles = {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.headerBG,
  } as AnimateStyle<ViewStyle> 

  const transformGameContainerStyles = useAnimatedStyle(() => {
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
        <Animated.View style={[ regularGameContainerStyles, transformGameContainerStyles ]}>
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

export default UI
