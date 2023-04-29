import React, { type PropsWithChildren } from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'

import { styled, common } from '~/styles/stitches.config'

const MenuTitleText = styled(Text, common.menuTextCommon)
const MenuTitleOuter = styled(View, {
//  position: 'absolute',
  backgroundColor: 'transparent',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  //width: '100%'
})
        {/* false && (<>
          <MenuTitle style={menuStyles.title} >chess both ways</MenuTitle>
          <Menu style={menuStyles.menu} />
        </>) */}

  /*
  const menuStyles = useMemo(() => ({
    title: {
      left: sizeRef.current.w  * OPEN_MENU_X_FRACTION * .1,
      top: theme.sizes.appBarHeight + theme.space[4],
      right: sizeRef.current.w  * OPEN_MENU_X_FRACTION * .1,
      height: theme.lineHeights.common
    },
    menu: {
      left: sizeRef.current.w  * OPEN_MENU_X_FRACTION * .1,
      top: theme.sizes.appBarHeight + theme.space[4] + 
        theme.lineHeights.common + theme.space[6],
      width: sizeRef.current.w  * OPEN_MENU_X_FRACTION * .8,
      height: 300
    } 

  }), [sizeRef.current])
  */


const MenuTitle: React.FC<{
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  children,
  style 
}) => (
  <MenuTitleOuter style={[style, {
    //alignItems: 'flex-start'
  }]}>
    <MenuTitleText>{children}</MenuTitleText>
    <View style={{height: 2, marginTop: 10, alignSelf: 'stretch', backgroundColor: 'white'}} collapsable={false}/>
  </MenuTitleOuter>
)


const Menu: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({
  style 
}) => (
  <View style={[style, {
    //position: 'absolute',
    backgroundColor: 'gray'
  }]} />
)

export {
  Menu as default,
  MenuTitle
}
