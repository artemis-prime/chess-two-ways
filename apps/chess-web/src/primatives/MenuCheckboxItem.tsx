import React, { type PropsWithChildren } from 'react'

import { styled, type CSS, common } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'

import type UnicodeIcon from './UnicodeIcon'
import MenuIcon, {  
  IconWidth,
  IconMargin,
  ICON_SPACE
} from './MenuIcon'
import Flex from './Flex'

const StyledLabel = styled('label', {
    
  all: 'unset',
  ...common.menu,
  ...debugBorder('white', 'menu'),
  cursor: 'pointer',
  display: 'flex', 
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'nowrap',
  pr: `${24 - IconMargin}px`,

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

const MenuCheckboxItem: React.FC<{
  checked: boolean
  setChecked: (b: boolean) => void
  icon?: UnicodeIcon
  css?: CSS
} & React.HTMLProps<HTMLInputElement>> = ({
  
  checked,
  setChecked, 
  icon,
  css,
  children
}) => {

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked)
  }

  return (
    <StyledLabel css={css} spaceForIcon={icon === ICON_SPACE}>
      <input type='checkbox' checked={checked} onChange={onChange} hidden/>
      <Flex direction='row' justify='start' css={{fontFamily: 'inherit', fontWeight: 'inherit'}}>
        {(icon !== ICON_SPACE) ? <MenuIcon icon={icon} /> : null}
        {children}
      </Flex>
      <MenuIcon icon={{icon: checked ? '\u2611' : '\u2610', style: {
        textAlign: 'right',
        top: 4,
        left: 7,
        opacity: 0.8,
        fontWeight: '400'
      }}} />
    </StyledLabel>
  )
}

export default MenuCheckboxItem
