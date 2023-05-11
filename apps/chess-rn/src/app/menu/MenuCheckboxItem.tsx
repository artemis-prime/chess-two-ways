import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { styled, common } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'

import {  
  CheckboxShell,
  type CheckboxViewProps,
  type WidgetIconDesc,
  WidgetIcon,
} from '~/primatives'

const MenuElementInnerView = styled(View, {
    
  ...debugBorder('white', 'menu'),
  height: common.typography.menu.item.lineHeight,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  variants: {
    pressed: {
      true: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: '$sm'
      }
    }
  }
})

const TitleWrapper = styled(Text, {
  ...common.typography.menu.item,
  ...debugBorder('orange', 'menu'),
  variants: {
    disabled: {
      true: {
        color: '$gray9'
      }
    },
    pressed: {
      true: {
        color: '$gray3',
      }
    },
  }
})

const MenuCheckboxView: React.FC<CheckboxViewProps> = ({
  checked,
  pressed,
  disabled, 
  icon,
  style,
  children
}) => (
  <MenuElementInnerView {...{checked, pressed: !!pressed, disabled: !!disabled}} style={style}>
    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
      {icon && <WidgetIcon state={disabled ? 'disabled' : pressed ? 'pressed' : 'default'} icon={icon} /> }
      <TitleWrapper {...{pressed: !!pressed, disabled: !!disabled}}>{children}</TitleWrapper>
    </View>
    <WidgetIcon state='default' icon={{icon: checked ? '\u2611' : '\u2610', style: {
      textAlign: 'right',
      top: 4,
      left: 7,
      opacity: 0.8,
      fontWeight: '400'
    }}} />
  </MenuElementInnerView>
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
    view={MenuCheckboxView} 
    icon={icon}
  />
)

export default MenuCheckboxItem
