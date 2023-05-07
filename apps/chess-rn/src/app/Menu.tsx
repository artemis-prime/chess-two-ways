import React, { type PropsWithChildren } from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'
import Animated, { type AnimateStyle } from 'react-native-reanimated'
import { observer } from 'mobx-react'

import { styled, common, css, useTheme } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'

import { MenuButton, MenuCheckbox } from '~/primatives'
import { useBoardOrientation, useGame } from '~/services'

const MenuOuter: React.FC<{
  animatedStyle: AnimateStyle<ViewStyle>
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  animatedStyle,
  style,
  children 
}) => {

  const theme = useTheme()

  return (
    <Animated.View 
      style={[
        {
          ...debugBorder('red', 'menuOuter'),
          position: 'absolute',
          left: 0,
          top: theme.sizes.appBarHeight,
          width: '100%', 
          paddingLeft: theme.space.menuPX,
          paddingRight: theme.space.menuPX,
          paddingBottom: theme.space.half,
          marginTop: theme.space.half,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }, 
        style,
        animatedStyle
      ]}
    >
      {children}
    </Animated.View>
  )
}


const MenuTitleText = styled(Text, 
  common.typography.menu.title,
  css({
    borderBottomColor: '$dashText',
    borderBottomWidth: 1,
    pt: '$menuSeparatorPY',
    mb: '$menuSeparatorPY',
  })
)

const MenuItemsOuter = styled(View, {
  ...debugBorder('off'),
  pt: '$singleAndHalf'
})


const Menu: React.FC<{
  width: number
  animatedStyle: AnimateStyle<ViewStyle>
  style?: StyleProp<ViewStyle>
}> = observer(({
  width,
  animatedStyle,
  style 
}) => {

  const bo = useBoardOrientation()
  const game = useGame()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <MenuOuter animatedStyle={animatedStyle} style={style}>
      <MenuItemsOuter style={{ 
        width: width * .9, 
        ...debugBorder('blue', 'menu')
      }}>
        <MenuTitleText>Board Direction</MenuTitleText>
        <MenuButton 
          onClick={swapDirection} 
          disabled={bo.autoOrientToCurrentTurn} 
          icon={'\u296F'}
        >swap</MenuButton>
        <MenuCheckbox 
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn}
          icon={'\u27F3'}//'\u27F3'
        >auto-swap</MenuCheckbox>
        <MenuTitleText>Game</MenuTitleText>
        {(game.playing) && (<>
          <MenuButton onClick={game.callADraw} icon={{icon: '=', style: {fontSize: 26, fontWeight: '300'}}}>call a draw</MenuButton>
          <MenuButton onClick={game.concede} icon={{icon: currentConcedes, style: {fontSize: 17, fontWeight: '300'}}}>{game.currentTurn} concedes</MenuButton>
          <MenuButton onClick={game.checkStalemate} icon={{icon: '\u0024?', style: {fontSize: 22, fontWeight: '300'}}}>check for stalemate</MenuButton>
        </>)}
        <MenuButton onClick={game.reset} icon={{icon: '\u21ba', style: {fontSize: 32}}}>reset</MenuButton>
      </MenuItemsOuter>
    </MenuOuter>
  )
})

// cycle arrow \u1F5D8
// double arrow \u296F
// dobule headed arrow \u2195

export default Menu
