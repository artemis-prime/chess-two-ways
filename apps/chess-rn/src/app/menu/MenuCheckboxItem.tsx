import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { typography, deborder, styled } from '~/style'

import {  
  CheckboxShell,
  type CheckboxViewProps,
  type WidgetIconDesc,
  WidgetIcon,
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
  style,
  children
}) => (
  <MenuCheckboxItemOuter {...{checked, pressed: !!pressed, disabled: !!disabled}} style={style}>
    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
      {icon && <WidgetIcon state={disabled ? 'disabled' : pressed ? 'pressed' : 'default'} icon={icon} /> }
      <ItemText {...{pressed: !!pressed, disabled: !!disabled}}>{children}</ItemText>
    </View>
    <WidgetIcon state='default' icon={{icon: checked ? '\u2611' : '\u2610', style: {
      textAlign: 'right',
      top: 4,
      left: 7,
      opacity: 0.8,
      fontWeight: '400'
    }}} />
  </MenuCheckboxItemOuter>
)

const MenuCheckboxItem: React.FC<{
  checked: boolean
  setChecked: (b: boolean) => void
  icon?: WidgetIconDesc
  style?: StyleProp<ViewStyle>
} & PressableProps & PropsWithChildren> = ({
  checked,
  setChecked,
  icon,
  ...rest
}) => (
  <CheckboxShell 
    {...rest} 
    checked={checked} 
    setChecked={setChecked} 
    view={MenuCheckboxItemCheckboxView} 
    icon={icon}
  />
)

export default MenuCheckboxItem
