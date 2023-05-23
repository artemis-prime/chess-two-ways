import React, { type PropsWithChildren } from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'
import Animated, { 
  useAnimatedStyle,
  type SharedValue 
} from 'react-native-reanimated'
import { observer } from 'mobx-react-lite'

import { typography, css, deborder, styled, useTheme } from '~/style'
import { useChessboardOrientation, useChess } from '~/services'

import { MenuItem, MenuCheckboxItem } from './menu'

const OPEN_MENU_X_FRACTION = 0.65 // TODO

const MenuOuter: React.FC<{
  animBase: SharedValue<number> 
  regStyle?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  animBase,
  regStyle,
  children 
}) => {

  const theme = useTheme()
  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: animBase.value,
  }))

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
  animBase: SharedValue<number> 
  regStyle?: StyleProp<ViewStyle>
}> = observer(({
  width,
  animBase,
  regStyle 
}) => {

  const bo = useChessboardOrientation()
  const game = useChess()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 
  return (
    <MenuOuter animBase={animBase} regStyle={regStyle}>
      <MenuItemsOuter css={{w: width * .9 * OPEN_MENU_X_FRACTION}}>
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

export {
  Menu as default
}
