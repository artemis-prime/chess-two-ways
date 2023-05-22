import React, { type PropsWithChildren } from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'
import Animated, { type AnimateStyle } from 'react-native-reanimated'
import { observer } from 'mobx-react-lite'

import { common, css, deborder, styled, useTheme } from '~/style'
import { useBoardOrientation, useChess } from '~/services'

import { MenuItem, MenuCheckboxItem } from './menu'

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
          ...deborder('red', 'menuOuter'),
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


const MenuSectionTitle = styled(Text, 
  common.typ.menu.title,
  css({
    borderBottomColor: '$dashText',
    borderBottomWidth: 1,
    pt: '$menuSeparatorPY',
    mb: '$menuSeparatorPY',
  })
)

const MenuItemsOuter = styled(View, {
  ...deborder('off'),
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
  const game = useChess()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <MenuOuter animatedStyle={animatedStyle} style={style}>
      <MenuItemsOuter style={{ 
        width: width * .9, 
        ...deborder('blue', 'menu')
      }}>
        <MenuSectionTitle>Board Direction</MenuSectionTitle>
        <MenuItem 
          onClick={swapDirection} 
          disabled={bo.autoOrientToCurrentTurn} 
          icon={'\u296F'}
        >swap</MenuItem>
        <MenuCheckboxItem 
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn}
          icon={'\u27F3'}//'\u27F3'
        >auto-swap</MenuCheckboxItem>
        <MenuSectionTitle>Game</MenuSectionTitle>
        {(game.playing) && (<>
          <MenuItem onClick={game.offerADraw} icon={{icon: '=', style: {fontSize: 26, fontWeight: '300'}}}>offer a draw</MenuItem>
          <MenuItem onClick={game.concede} icon={{icon: currentConcedes, style: {fontSize: 17, fontWeight: '300'}}}>{game.currentTurn} concedes</MenuItem>
        </>)}
        <MenuItem onClick={game.reset} icon={{icon: '\u21ba', style: {fontSize: 32}}}>reset</MenuItem>
      </MenuItemsOuter>
    </MenuOuter>
  )
})

// cycle arrow \u1F5D8
// double arrow \u296F
// dobule headed arrow \u2195

export default Menu
