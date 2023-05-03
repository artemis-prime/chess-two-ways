import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native'

import { styled, common } from '~/styles/stitches.config'

import ButtonShell, {type ButtonViewProps} from './ButtonShell'
import type UnicodeIcon from './UnicodeIcon'
import MenuIcon from './MenuIcon'

const MenuElementInnerView = styled(View,  {
    
  height: common.menuTextCommon.lineHeight,
  width: '100%',
  //borderWidth: 0.5,
  //borderColor: 'white',
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
      default: {}
    }
  }
})

const TitleWrapper = styled(Text, {
  ...common.menuTextCommon,
  fontWeight: '$bold',
  variants: {
    state: {
      disabled: {
        color: '$gray9'
      },
      pressed: {
        color: '$gray3',
      },
      default: {}
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
    <MenuIcon state={state} icon={icon} />
    <TitleWrapper state={state} >{children}</TitleWrapper>
  </MenuElementInnerView>
) 
  
const MenuButton: React.FC<{
  onClick: () => void
  icon: UnicodeIcon,
  style?: StyleProp<ViewStyle>
} & PropsWithChildren & PressableProps> = ({
  children,
  onClick,
  icon,
  style,
  ...rest
}) => (
  <ButtonShell 
    {...rest} 
    onClick={onClick} 
    view={MenuButtonInner} 
    icon={icon} 
    style={style}  
  >
    {children}
  </ButtonShell>
)

export default MenuButton
