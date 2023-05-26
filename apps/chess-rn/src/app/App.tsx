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

import { Game, Main } from './appComponents'
import Menu from './Menu'

const dim = Dimensions.get('screen')
const ANIM_DURATION = 100 // ms

const App: React.FC = () => {

  const ui = useMenu()
  const sizeRef = useRef<{w: number, h: number}>({w: dim.width, h: dim.height})

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

    // Not a 'worklet', but the callback is! (dunno <shrug>)
    // It also can't be defined inline for some odd reason.
    // (reanimated babel plugin issue?).
  const animate = () => {
    const animationEnded = () => { ui.setMenuVisible(!ui.menuVisible) }
    animBase.value = withTiming(
      ui.menuVisible ? 0 : 1, 
      { 
        duration: ANIM_DURATION, 
        easing: ui.menuVisible ? Easing.out(Easing.linear) : Easing.in(Easing.linear) 
      },
      () => { runOnJS(animationEnded)() }
    )
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent'} />
      <Main animBase={animBase} toggleMenu={toggleMenu}>
        <Menu animBase={animBase} width={sizeRef.current.w}/>
        <Game animBase={animBase} toggleMenu={toggleMenu} width={sizeRef.current.w} />
      </Main>
    </SafeAreaView>
  )
}

export default App
