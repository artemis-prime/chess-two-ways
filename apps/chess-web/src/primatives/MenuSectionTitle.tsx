import React from 'react'
import { styled, type CSS, common } from '~/styles/stitches.config'

import type { HTMLProps } from 'react'

// Following this: 
// https://m3.material.io/components/navigation-drawer/specs

// https://m3.material.io/styles/typography/type-scale-tokens#d74b73c2-ac5d-43c5-93b3-088a2f67723d
const StyledHeading = styled('h6', {

  all: 'unset',
  ...common.menu,
  borderRadius: 0,
  pl: 0,
  ml: '$menuPL',
  mr: '$menuPL',
  borderBottom: '1px solid currentColor',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxSizing: 'border-size',
  cursor: 'default',
  outline: 'none',
  color: 'inherit',
  //...debugBorder('yellow', 'menuitem'),
})

const MenuSectionTitle: React.FC<{
  css?: CSS,
} & HTMLProps<HTMLHeadingElement>> = ({
  css,
  children,
}) => (
  <StyledHeading css={css} >
    {children}
  </StyledHeading> 
)

export {
  MenuSectionTitle as default,
}
