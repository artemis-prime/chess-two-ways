import React, { PropsWithChildren, useEffect } from 'react'
import { 
  Text,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { observer } from 'mobx-react'

import { styled } from '~/style/stitches.config'

import { CheckboxShell, type CheckboxViewProps } from '~/primatives'
import { useUI } from '~/service'


const MenuButtonCheckboxView = styled(Text, {
  color: 'white',
  lineHeight: '$common',
  //w:'$common',
  h: '$common',
  px: '$3',
  fontSize: 22,
  //textAlign: 'center',
  fontWeight: "900",
  variants: {
    checked: {
      true: { 
        fontSize: 30,
        px: '$2',
        lineHeight: 32,
        //top: 
      },
      false: { }
    },
    disabled: {
      true: {
        color: '$gray8'
      }
    },
    pressed: {
      true: {
        borderRadius: '$sm',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }
    }
  }
})

const MenuButtonView: React.FC<CheckboxViewProps> = ({
  checked,
  pressed,
  disabled, 
  style
}) => (
  <MenuButtonCheckboxView {...{checked, pressed: !!pressed, disabled: !!disabled}} style={style}>
    {checked ? '\u21F1' /* '\u276E' '\u2018' */: '\u2630'}
  </MenuButtonCheckboxView>
)

const MenuButton: React.FC<{
  setMenuOpen: (b: boolean) => void
  style?: StyleProp<ViewStyle>
} & PressableProps & PropsWithChildren> = observer(({
  setMenuOpen,
  ...rest
  }
) => {

  const ui = useUI()
  return (
    <CheckboxShell {...rest} checked={ui.menuOpen} setChecked={setMenuOpen} view={MenuButtonView} />
  )
})

export default MenuButton
