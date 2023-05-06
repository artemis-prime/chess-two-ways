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
import { useBoardOrientation } from '~/services'

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
          //paddingTop: theme.space[1],
          paddingBottom: theme.space[1],
          marginTop: theme.space[1],
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
    pb: '$menuSeparatorPY',
    mb: '$menuSeparatorPY',
  })
)

const MenuItemsOuter = styled(View, {
  ...debugBorder('off'),
  pt: '$3'
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
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  return (
    <MenuOuter animatedStyle={animatedStyle} style={style}>
      <MenuItemsOuter style={{ 
        width: width * .9, 
        ...debugBorder('blue', 'menu')
      }}>
        <MenuTitleText>View</MenuTitleText>
        <MenuButton 
          onClick={swapDirection} 
          disabled={bo.autoOrientToCurrentTurn} 
          icon={'\u296F'}
        >swap view</MenuButton>
        <MenuCheckbox 
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn.bind(bo)}
          icon={'\u27F3'}
        >auto-swap view</MenuCheckbox>
      </MenuItemsOuter>
    </MenuOuter>
  )
})

// cycle arrow \u1F5D8
// double arrow \u296F
// dobule headed arrow \u2195

export default Menu
