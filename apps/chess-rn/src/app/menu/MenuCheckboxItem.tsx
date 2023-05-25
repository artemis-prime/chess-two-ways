import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  View,
  type PressableProps,
} from 'react-native'

import { typography, deborder, styled, type CSS, useTheme } from '~/style'

import { Row, ButtonBase } from '~/primatives'

import WidgetIcon, {
  IconWidth,
  IconMargin
} from './WidgetIcon' 
import type WidgetIconDesc from './WidgetIconDesc'

const ItemText = styled(Text, {

  ...deborder('orange', 'menu'),
  ...typography.menu.item,
  variants: {
    disabled: { true: {color: '$menuTextColorDisabled'}},
    icon: { false: { ml: IconWidth + IconMargin } }
  },
})

const MenuCheckboxItem: React.FC<
  {
    checked: boolean
    setChecked: (b: boolean) => void
    disabled?: boolean
    icon?: WidgetIconDesc
  } 
  & PropsWithChildren
> = ({
  checked,
  setChecked,
  disabled,
  icon,
  children
}) => {
  const theme = useTheme()
  return (
    <ButtonBase 
      feedbackOptions={{
        bgColor: [theme.colors.menuBGColor, theme.colors.menuBGColorPressed] 
      }}
      containerStyle={{
        ...deborder('white', 'menu'),
        height: theme.lineHeights.lineHeightMenu,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: theme.space[1],
        paddingRight: theme.space[1],
        borderRadius: theme.radii.menuRadius,
      }}
      on={checked}
      disabled={disabled}
      onClick={setChecked}
    >
      <Row>
        {icon && <WidgetIcon disabled={disabled} icon={icon} />}
        <ItemText disabled={disabled} icon={!!icon}>{children}</ItemText>
      </Row>
      <WidgetIcon state='default' icon={{icon: checked ? '\u2611' : '\u2610', style: {
        textAlign: 'right',
        top: 4,
        left: 7,
        opacity: 0.8,
        fontWeight: '400'
      }}} />
    </ButtonBase>
  )
}
export default MenuCheckboxItem
