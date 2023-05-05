import React from 'react'
import { Text } from 'react-native'
import { styled, common } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'

import type UnicodeIcon from './UnicodeIcon'

const UnicodeWrapper = styled(Text, {
  ...common.typography.menu.item,
  ...debugBorder('yellow', 'menu'),
  fontSize: 36,
  fontWeight: '$bold',
  
  width: 32,
  textAlign: 'center',
  left: -5,
  mr: 4,
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
  },
  defaultVariants: {
    state: 'default'
  }
})

const MenuIcon: React.FC<{
  icon: UnicodeIcon | undefined
  state: 'disabled' | 'pressed' | string
}> = ({
  icon,
  state
}) => {
  if (icon === undefined) {
    return null
  }
  let unicode = (typeof icon === 'string') ? icon as string : icon.icon 
  let style = (typeof icon === 'string') ? {} : icon.style 
  const stateToSpread = ['disabled', 'pressed'].includes(state) ? {state: state as 'disabled' | 'pressed'} : {}
  return (

    <UnicodeWrapper {...stateToSpread} style={style}>{unicode}</UnicodeWrapper>
  )
}

export default MenuIcon
