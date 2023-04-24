import React, { useRef, useState, useEffect } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'
import { observer } from 'mobx-react'

import { styled, useTheme } from '~/style/stitches.config'
import { useUI } from '~/service'
import { BGImage } from '~/primatives'

import Board from './Board'
import Dash from './Dash'

  //https://reactnative.dev/docs/dimensions
const screenDimensions = Dimensions.get('screen')

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
    padForStatus: {
      true: {},
      false: {
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
  const menuAnimationValue = useRef(new Animated.Value(0)).current
  const widthRef = useRef<number>(screenDimensions.width)
  const theme = useTheme()
  const ui = useUI()

    //https://reactnative.dev/docs/dimensions
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({screen}) => {
        widthRef.current = screen.width;
      },
    );
    return () => subscription?.remove();
  })

  const setMenuOpen = (opening: boolean): void => {
    if (opening) {
      setPadForStatusBar(false)
    }
    Animated.timing(menuAnimationValue, {
      toValue: opening ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      ui.setMenuOpen(opening)
      if (!opening) {
        setPadForStatusBar(true)
      }
    })
  } 

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View style={{width: '100%', height: '100%', backgroundColor: theme.colors.headerBG}} >
        <Animated.View style={{
          width: '100%',
          height: '100%',
          backgroundColor: theme.colors.headerBG,
          transform: [
            {
              translateX: menuAnimationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, widthRef.current  * .6] 
              })
            },
            {
              translateY: menuAnimationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 120]
              })
            }
          ],
        }}>
        <BGImageView imageURI={'chess_bg_1920'} >
          <View style={{ 
              // pseudo margin element... best way to achieve the desired animation effect
            width: '100%', 
            height: StatusBar.currentHeight!, 
              // slight tint to match MainContainer 
            backgroundColor : padForStatusBar ? 'rgba(0, 0, 0, 0.2)' : theme.colors.headerBG 
          }} />
          <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
          {!padForStatusBar && <CornerShim left={0} top={StatusBar.currentHeight!} /> }
          <MainContainer padForStatus={padForStatusBar}>
            <Dash setMenuOpen={setMenuOpen} />
            <Board />
          </MainContainer>
        </BGImageView>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
})

export default UI
