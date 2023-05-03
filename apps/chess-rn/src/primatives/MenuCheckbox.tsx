import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { styled, common } from '~/styles/stitches.config'

import { CheckboxShell, type CheckboxViewProps } from '~/primatives'
import MenuIcon from './MenuIcon'
import type UnicodeIcon from './UnicodeIcon'

const MenuElementInnerView = styled(View, {
    
  height: common.menuTextCommon.lineHeight,
  width: '100%',
  //borderWidth: 0.5,
  //borderColor: 'white',
  flexDirection: 'row',
  justifyContent: 'space-between',
  //alignItems: 'center',
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
  ...common.menuTextCommon,
  fontWeight: '$bold',
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
      <MenuIcon state={disabled ? 'disabled' : pressed ? 'pressed' : 'default'} icon={icon} />
      <TitleWrapper {...{pressed: !!pressed, disabled: !!disabled}}>{children}</TitleWrapper>
    </View>
    <MenuIcon state='default' icon={{icon: checked ? '\u2611' : '\u2610', style: {
      textAlign: 'right',
      //borderWidth: 0.5,
      //borderColor: 'yellow',
      top: 3,
      left: 4
    }}} />
  </MenuElementInnerView>
)

const MenuCheckbox: React.FC<{
  checked: boolean
  setChecked: (b: boolean) => void
  icon?: UnicodeIcon
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

export default MenuCheckbox
