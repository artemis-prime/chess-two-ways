import React, { useRef, useState, useEffect } from 'react'
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  View,
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
  interpolateColor
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

const MainContainer = styled(View, {

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

const BGImageView = styled(BGImage, {

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: '100%',
})

const UI: React.FC = observer(() => {

  const [padForStatusBar, setPadForStatusBar] = useState<boolean>(true)
  const widthRef = useRef<number>(screenDimensions.width)
  const theme = useTheme()
  const ui = useUI()

    // 0 <--> 1, styles are interpolated as needed
  const menuAnimation = useSharedValue(0) 
  const menuOpenProxy = useSharedValue(false)

  autorun(() => {
    menuOpenProxy.value = ui.menuOpen
  })

    //https://reactnative.dev/docs/dimensions
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({screen}) => {
        widthRef.current = screen.width
      },
    )
    return () => {subscription?.remove()}
  })
  
  const onMenuAnimationDone = (open: boolean) => {
    ui.setMenuOpen(open)
    if (!open) {
      setPadForStatusBar(true)
    }
  }

  const gesture = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .runOnJS(true)
    .onBegin((e) => {
    })
    .onStart((e) => {

      if (!menuOpenProxy.value) {
        setPadForStatusBar(false)
      }
      menuAnimation.value = withTiming(
        menuOpenProxy.value ? 0 : 1, 
        {
          duration: 200,
          easing: menuOpenProxy.value ? Easing.out(Easing.exp) : Easing.in(Easing.exp),
        },
        () => {
          // https://docs.swmansion.com/react-native-reanimated/docs/api/miscellaneous/runOnJS/
          // Calling a mobx store or modifying a React ref is not allowed on the UI thread.
          // We could have used a SharedValue, but this is simpler.
          runOnJS(onMenuAnimationDone)(!menuOpenProxy.value)
        }
      )
    })

  const transformStyle = useAnimatedStyle(() => {
    const translateX = interpolate(menuAnimation.value, [0, 1], [0, widthRef.current  * OPEN_MENU_X_FRACTION], { extrapolateRight: Extrapolation.CLAMP })
    const translateY = interpolate(menuAnimation.value, [0, 1], [0, OPEN_MENU_Y_OFFSET], { extrapolateRight: Extrapolation.CLAMP })

    return {
      transform: [{ translateX }, { translateY }]
    }
  })

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View style={{width: '100%', height: '100%', backgroundColor: theme.colors.headerBG}} >
        <Animated.View style={[{
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.headerBG,
          },
          transformStyle
        ]}>
        <BGImageView imageURI={'chess_bg_1920'} >
          <Animated.View style={{ 
              // pseudo margin element... best way to achieve the desired animation effect
            width: '100%', 
            height: StatusBar.currentHeight!, //interpolate(menuAnimation.value, [0, 1], [StatusBar.currentHeight!, 0]), 
              // slight tint to match MainContainer 
            backgroundColor : interpolateColor(menuAnimation.value, [0, 1], 
              ['rgba(0, 0, 0, 0.2)', theme.colors.headerBG]
            )
          }} />
          <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
          {ui.menuOpen && <CornerShim left={0} top={StatusBar.currentHeight!} /> }
          <MainContainer showBorder={ui.menuOpen}>
            <Dash >
              <MenuFlingHandle open={ui.menuOpen} gesture={gesture}/>
            </Dash>
            <Board />
          </MainContainer>
        </BGImageView>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
})

export default UI
