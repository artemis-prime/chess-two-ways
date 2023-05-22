import React from 'react'
import { Text } from 'react-native'
import { common, deborder, styled } from '~/style'

import type WidgetIconDesc from './WidgetIconDesc'

const IconXOffset = -5
const IconWidth = 32
const IconMargin = 4

const UnicodeWrapper = styled(Text, {
  ...common.typ.menu.item,
  ...deborder('yellow', 'menu'),
  fontSize: 36,
  fontWeight: '$bold',
  
  width: IconWidth,
  textAlign: 'center',
  left: IconXOffset,
  mr: IconMargin,
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

const WidgetIcon: React.FC<{
  icon: WidgetIconDesc | undefined
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

export {
  WidgetIcon as default,
  IconXOffset,
  IconWidth,
  IconMargin
}
