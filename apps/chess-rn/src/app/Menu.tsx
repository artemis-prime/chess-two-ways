import React, { useEffect, type PropsWithChildren } from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'
import Animated, { 
  type AnimateStyle, 
  type SharedValue 
} from 'react-native-reanimated'
import { observer } from 'mobx-react-lite'

import { typography, css, deborder, styled, useTheme } from '~/style'
import { useChessboardOrientation, useChess } from '~/services'

import { MenuItem, MenuCheckboxItem } from './menu'

const getMenuAnimStyles = (v: SharedValue<number>): ViewStyle => {
  'worklet';
  return {
    opacity: v.value,
  }
} 

const MenuOuter: React.FC<{
  animatedStyle: AnimateStyle<ViewStyle>
  regStyle?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  animatedStyle,
  regStyle,
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
          paddingLeft: theme.space.pxMenu,
          paddingRight: theme.space.pxMenu,
          paddingBottom: theme.space._5,
          marginTop: theme.space._5,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: theme.colors.menuBGColor
        }, 
        regStyle,
        animatedStyle
      ]}
    >
      {children}
    </Animated.View>
  )
}


const MenuSectionTitle = styled(Text, 
  typography.menu.sectionTitle,
  css({
    borderBottomColor: '$chalkboardTextColor',
    borderBottomWidth: 1,
    pt: '$pyMenuSeparator',
    mb: '$pyMenuSeparator',
  })
)

const MenuItemsOuter = styled(View, {
  ...deborder('green', 'menu'),
  pt: '$1_5'
})


const Menu: React.FC<{
  width: number
  animatedStyle: AnimateStyle<ViewStyle>
  regStyle?: StyleProp<ViewStyle>
}> = observer(({
  width,
  animatedStyle,
  regStyle 
}) => {

  const bo = useChessboardOrientation()
  const game = useChess()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <MenuOuter animatedStyle={animatedStyle} regStyle={regStyle}>
      <MenuItemsOuter css={{w: width * .9}}>
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

export {
  Menu as default,
  getMenuAnimStyles
}
