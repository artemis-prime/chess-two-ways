import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  Text,
  View,
} from 'react-native'

import { typography, deborder, styled, type CSS } from '~/style'

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
  css
}) => (
  <MenuItemOuter state={state} css={css}>
    {icon && <WidgetIcon state={state} icon={icon} />}
    <ItemText state={state} icon={!!icon}>{children}</ItemText>
  </MenuItemOuter>
) 
  
const MenuItem: React.FC<
  {
    onClick: () => void
    icon?: WidgetIconDesc
    css?: CSS
  } 
  & PropsWithChildren 
  & Omit<PressableProps, 'style'>
> = ({
  children,
  ...rest
}) => (
  <ButtonShell {...rest} view={MenuItemButtonView} >
    {children}
  </ButtonShell>
)

export default MenuItem
