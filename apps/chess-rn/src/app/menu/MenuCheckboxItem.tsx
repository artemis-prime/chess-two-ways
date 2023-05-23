import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  View,
  type PressableProps,
} from 'react-native'

import { typography, deborder, styled, type CSS } from '~/style'

import {  
  CheckboxShell,
  type CheckboxViewProps,
  type WidgetIconDesc,
  WidgetIcon,
  Row,
} from '~/primatives'

const MenuCheckboxItemOuter = styled(View, {
    
  ...deborder('white', 'menu'),
  height: typography.menu.item.lineHeight,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  variants: {
    pressed: {
      true: {
        backgroundColor: '$menuBGColorPressed',
        borderRadius: '$menuRadius' 
      }
    }
  }
})

const ItemText = styled(Text, {
  ...typography.menu.item,
  ...deborder('orange', 'menu'),
  variants: {
    disabled: {
      true: {
        color: '$menuTextDisabled'
      }
    },
    pressed: { true: {} }
  }
})

const MenuCheckboxItemCheckboxView: React.FC<CheckboxViewProps> = ({
  checked,
  pressed,
  disabled, 
  icon,
  css,
  children
}) => (
  <MenuCheckboxItemOuter {...{checked, pressed: !!pressed, disabled: !!disabled}} css={css}>
    <Row>
      {icon && <WidgetIcon state={disabled ? 'disabled' : pressed ? 'pressed' : 'default'} icon={icon} /> }
      <ItemText {...{pressed: !!pressed, disabled: !!disabled}}>{children}</ItemText>
    </Row>
    <WidgetIcon state='default' icon={{icon: checked ? '\u2611' : '\u2610', style: {
      textAlign: 'right',
      top: 4,
      left: 7,
      opacity: 0.8,
      fontWeight: '400'
    }}} />
  </MenuCheckboxItemOuter>
)

const MenuCheckboxItem: React.FC<
  {
    checked: boolean
    setChecked: (b: boolean) => void
    icon?: WidgetIconDesc
    css?: CSS
  } 
  & Omit<PressableProps, 'style'> 
  & PropsWithChildren
> = (
  props
) => (
  <CheckboxShell {...props} view={MenuCheckboxItemCheckboxView} />
)

export default MenuCheckboxItem
