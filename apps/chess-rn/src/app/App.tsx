import React from 'react'
import { StatusBar } from 'react-native'
import { 
  Easing, 
  withTiming,
  runOnJS,
  useSharedValue, 
} from 'react-native-reanimated'

import { useMenu, useMeasuredStatusBar } from '~/services'

import GameArea from './GameArea'
import Main from './Main'
import Menu from './Menu'
const ANIM_DURATION = 100 // ms

const App: React.FC = () => {

  const menu = useMenu()
  const onLayout = useMeasuredStatusBar()

    // 0 (menu closed) <--> 1 (menu open)   
    // menu.visible is updated at the END of the animation.
  const animBase = useSharedValue<number>(menu.visible ? 1 : 0) 

    // Not a 'worklet', but the end callback is! 
    // It also can't be defined inline for some odd reason.
    // (reanimated babel plugin issue?).
  const toggleMenu = () => {
    const actualToggle = () => { menu.setVisible(!menu.visible) }
    animBase.value = withTiming(
      menu.visible ? 0 : 1, 
      { 
        duration: ANIM_DURATION, 
        easing: menu.visible ? Easing.out(Easing.linear) : Easing.in(Easing.linear) 
      },
      () => { runOnJS(actualToggle)() } // called at end
    )
  }

  return (
    <Main animBase={animBase} toggleMenu={toggleMenu} onLayout={onLayout}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor={'transparent' /*'rgba(100, 0, 0, .4)'*/} />
      <Menu animBase={animBase} />
      <GameArea animBase={animBase} toggleMenu={toggleMenu} />
    </Main>
  )
}

export default App
