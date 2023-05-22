import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native'

import { typography, deborder, styled } from '~/style'

import {  
  ButtonShell,
  type ButtonViewProps,
  type WidgetIconDesc,
  WidgetIcon,
  IconWidth,
  IconMargin
} from '~/primatives'

const MenuItemOuter = styled(View,  {

  ...deborder('white', 'menu'),
  height: typography.menu.item.lineHeight,
  width: '100%',
  textAlignVertical: 'center',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  variants: {
    state: {
      disabled: {
      },
      pressed: {
        backgroundColor: '$menuBGColorPressed',
        borderRadius: '$menuRadius' 
      },
      normal: {}
    }
  }
})

const ItemText = styled(Text, {
  ...typography.menu.item,
  ...deborder('orange', 'menu'),
  variants: {
    state: {
      disabled: {
        color: '$menuTextDisabled'
      },
      pressed: {},
      normal: {}
    },
    icon: {
      false: {
        marginLeft: IconWidth + IconMargin
      }
    }
  }
})

const MenuItemButtonView: React.FC<ButtonViewProps> = ({
  state,
  icon,
  children,
  style
}) => (
  <MenuItemOuter state={state} style={style}>
    {icon && <WidgetIcon state={state} icon={icon} />}
    <ItemText state={state} icon={!!icon}>{children}</ItemText>
  </MenuItemOuter>
) 
  
const MenuItem: React.FC<{
  onClick: () => void
  icon?: WidgetIconDesc,
  style?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  children,
  icon,
  style,
  ...rest
}) => (
  <ButtonShell 
    {...rest} 
    view={MenuItemButtonView} 
    icon={icon} 
    style={style}  
  >
    {children}
  </ButtonShell>
)

export default MenuItem
