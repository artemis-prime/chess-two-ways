import React from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'
import { observer } from 'mobx-react'

import { styled, common, css } from '~/styles/stitches.config'

import { MenuButton, MenuCheckbox } from '~/primatives'
import { useBoardOrientation } from '~/services'


const MenuOuter = styled(View, {
  position: 'absolute',
  display: 'none',
  left: 0,
  top: '$sizes$appBarHeight',
  width: '100%', 
  px: '$3',
  py: '$1',
  mt: '$1',

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',

  //borderWidth: 1,
  //borderColor: 'red',

  variants: {
    visible: {
      true: {
        display: 'flex'
      }
    }
  }
})

const MenuTitleText = styled(Text, 
  common.menuTextTitle,
  css({
    borderBottomColor: '$dashText',
    borderBottomWidth: 1
  })
)

const MenuItemsOuter = styled(View, {
  //borderWidth: 1,
  //borderColor: 'red',
  pt: '$3'
})


const Menu: React.FC<{
  visible: boolean  
  width: number
  style?: StyleProp<ViewStyle>
}> = observer(({
  visible,
  width,
  style 
}) => {

  const bo = useBoardOrientation()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  return (
    <MenuOuter visible={visible} style={style}>
      <MenuTitleText>Chess two ways - Android</MenuTitleText>
      <MenuItemsOuter style={{ width: width * .9, /* borderWidth: 0.5,borderColor: 'red', */}}>
        <MenuButton 
          onClick={swapDirection} 
          disabled={bo.autoOrientToCurrentTurn} 
          icon={{icon: '\u296F', style: {
            top: -1,
          }}}
        >swap view</MenuButton>
        <MenuCheckbox 
          //style={{marginLeft: 28}}
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn.bind(bo)}
          icon={'\u27F3'}
        >auto-sync view</MenuCheckbox>
      </MenuItemsOuter>
    </MenuOuter>
  )
})

// cycle arrow \u1F5D8
// double arrow \u296F
// dobule headed arrow \u2195

export default Menu
