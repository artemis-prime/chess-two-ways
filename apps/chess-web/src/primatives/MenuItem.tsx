import React from 'react'
import { styled, type CSS, common } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'

import type UnicodeIcon from './UnicodeIcon'
import type { HTMLProps } from 'react'

import MenuIcon, {  
  IconWidth,
  IconMargin,
  ICON_SPACE
} from './MenuIcon'

// Following this: 
// https://m3.material.io/components/navigation-drawer/specs

// https://m3.material.io/styles/typography/type-scale-tokens#d74b73c2-ac5d-43c5-93b3-088a2f67723d
const StyledButton = styled('button', {

  all: 'unset',
  ...common.menu,
  ...debugBorder('yellow', 'menu'),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxSizing: 'border-size',
  cursor: 'pointer',
  outline: 'none',

  '&:hover': {
    backgroundColor: '$menuHover'
  },
  '&:active': {
    backgroundColor: '$menuPressed'
  },

  variants: {
    spaceForIcon: {
      true: {
        paddingLeft: `${16 + IconWidth + IconMargin}px`
      }
    }
  }
})

const MenuItem: React.FC<{
  icon?: UnicodeIcon
  css?: CSS,
} & HTMLProps<HTMLButtonElement>> = ({
  onClick,
  icon,
  css,
  disabled,
  children,
}) => (
    // Was getting very odd typescript issues w ...rest / spread 
  <StyledButton onClick={onClick} disabled={disabled} css={css} spaceForIcon={icon === ICON_SPACE}>
    {(icon !== ICON_SPACE) ? <MenuIcon icon={icon} /> : null}
    {children}
  </StyledButton> 
)

export {
  MenuItem as default,
}
