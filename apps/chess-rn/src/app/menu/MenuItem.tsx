import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native'

import { common, deborder, styled } from '~/style'

import {  
  ButtonShell,
  type ButtonViewProps,
  type WidgetIconDesc,
  WidgetIcon,
  IconWidth,
  IconMargin
} from '~/primatives'

const MenuElementInnerView = styled(View,  {

  ...deborder('white', 'menu'),
  height: common.typ.menu.item.lineHeight,
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: '$sm'
      },
      normal: {}
    }
  }
})

const TitleWrapper = styled(Text, {
  ...common.typ.menu.item,
  ...deborder('orange', 'menu'),
  variants: {
    state: {
      disabled: {
        color: '$gray9'
      },
      pressed: {
        color: '$gray3',
      },
      normal: {}
    },
    icon: {
      false: {
        marginLeft: IconWidth + IconMargin
      }
    }
  }
})

const MenuButtonInner: React.FC<ButtonViewProps> = ({
  state,
  icon,
  children,
  style
}) => (
  <MenuElementInnerView state={state} style={style}>
    {icon && <WidgetIcon state={state} icon={icon} />}
    <TitleWrapper state={state} icon={!!icon}>{children}</TitleWrapper>
  </MenuElementInnerView>
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
    view={MenuButtonInner} 
    icon={icon} 
    style={style}  
  >
    {children}
  </ButtonShell>
)

export default MenuItem
