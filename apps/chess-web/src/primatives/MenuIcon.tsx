import React, { type  CSSProperties } from 'react'

import { styled, css } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'

import type UnicodeIcon from './UnicodeIcon'

const IconWidth = 24
const IconMargin = 11 // fudging a bit from MD3 spec
const ICON_SPACE = 'space' 

const UnicodeWrapper = styled('span', {
  ...debugBorder('yellow', 'menu'),
  fontSize: IconWidth,
  fontWeight: '$bold',
  
  width: `${IconWidth}px`,
  textAlign: 'center',
  mr: `${IconMargin}px`,
})

const MenuIcon: React.FC<{
  icon: UnicodeIcon | undefined
}> = ({
  icon,
}) => {
  if (icon === undefined) {
    return null
  }
  let unicode = (typeof icon === 'string') ? icon as string : icon.icon 
  let style = (typeof icon === 'string') ? {} : icon.style 

  return (
    <UnicodeWrapper style={style as CSSProperties }>{unicode}</UnicodeWrapper>
  )
}

export {
  MenuIcon as default,
  IconWidth,
  IconMargin,
  ICON_SPACE
}
