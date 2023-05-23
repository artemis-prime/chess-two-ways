import React, { 
  useRef, 
  useEffect, 
  useState, 
} from 'react'
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { observer } from 'mobx-react-lite'
import Animated, { 
  useSharedValue, 
  Easing, 
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

import { useTheme } from '~/style'
import { useMenu } from '~/services'

import Chessboard from './Chessboard'
import Chalkboard from './Chalkboard'
import Menu from './Menu'

import {
  CornerShim,
  GameProperOuter,
  GameContainer,
  LogoButton,
  OuterContainer,
  StatusBarSpacer,
} from './appComponents'

const screenDimensions = Dimensions.get('screen')

const GameProper: React.FC<{
  toggleMenu: () => void
  showBorder: boolean 
}> = observer(({
  toggleMenu,
  showBorder
}) => {
  const ui = useMenu()
  const theme = useTheme()
  return (
      // This must be an animated view AND IN THIS FILE
      // due to what seems to be a subtle r-n-reanimated bug.
    <GameProperOuter showBorder={showBorder}>
      <Animated.View collapsable={false} style={{gap: theme.space['1_5']}}>
        <Chalkboard disableInput={ui.menuVisible} menuVisible={ui.menuVisible} toggleMenu={toggleMenu} />
        <Chessboard disableInput={ui.menuVisible} />
      </Animated.View>
    </GameProperOuter >
  )
})

const App: React.FC = () => {

  const sizeRef = useRef<{w: number, h: number}>({w: screenDimensions.width, h: screenDimensions.height})
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

  const onAnimationFinished = (): void => { 
    menuVisible.value = !menuVisible.value
    if (menuVisible.value) {
      setMenuFullyVisible(true)  
    }
    ui.setMenuVisible(menuVisible.value) 
  }

  const toggleMenu = () => { animate() }

    // Sometimes this is called from a click. 
    // Sometimes as onStart() of a drag gesture, 
    // which means it's on the UI thread.
    // We have to designate it as a 'worklet'; 
  const animate = () => {
    onAnimationStarted()
    animBase.value = withTiming(
      menuVisible.value ? 0 : 1, 
      { duration: 200, easing: menuVisible.value ? Easing.out(Easing.linear) : Easing.in(Easing.linear) },
      () => { runOnJS(onAnimationFinished)() }
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
          <GameProper showBorder={menuFullyVisible} toggleMenu={toggleMenu} />
        </GameContainer>
        <LogoButton animBase={animBase} onClick={toggleMenu} />
      </OuterContainer>
    </SafeAreaView>
  )
}

export default App
