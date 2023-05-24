import React, { 
  useRef, 
  useEffect, 
} from 'react'
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { 
  useSharedValue, 
  Easing, 
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

import { useMenu } from '~/services'

import Menu from './Menu'

import {
  CornerShim,
  GameContainer,
  LogoButton,
  OuterContainer,
  StatusBarSpacer,
  Game
} from './appComponents'

const screenDimensions = Dimensions.get('screen')

const App: React.FC = () => {

  const sizeRef = useRef<{w: number, h: number}>({w: screenDimensions.width, h: screenDimensions.height})
  const ui = useMenu()

    // 0 <--> 1   
    // menu hidden <--> menu visible 
    // Animated styles are interpolated as needed.
    // ui.menuVisible is updated at the END of the animation.
  const animBase = useSharedValue<number>(ui.menuVisible ? 1 : 0) 

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change',
      ({screen}) => { sizeRef.current = {w: screen.width, h: screen.height }},
    )
    return () => { subscription.remove() }
  }, [])

  const toggleMenu = () => { animate() }
  const animationEnded = () => { ui.setMenuVisible(!ui.menuVisible) }

    // Not a 'worklet', but the callback is! (dunno <shrug>)
    // It also can't be defined inline for some odd reason.
    // (reanimated babel plugin issue?).
  const animate = () => {
    animBase.value = withTiming(
      ui.menuVisible ? 0 : 1, 
      { duration: 200, easing: ui.menuVisible ? Easing.out(Easing.linear) : Easing.in(Easing.linear) },
      () => { runOnJS(animationEnded)() }
    )
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
      <OuterContainer>
        <Menu animBase={animBase} width={sizeRef.current.w}/>
        <GameContainer animBase={animBase} width={sizeRef.current.w}>
          <StatusBarSpacer animBase={animBase} />
          <CornerShim animBase={animBase} />
          <Game animBase={animBase} toggleMenu={toggleMenu} />
        </GameContainer>
        <LogoButton animBase={animBase} onClick={toggleMenu} />
      </OuterContainer>
    </SafeAreaView>
  )
}

export default App
