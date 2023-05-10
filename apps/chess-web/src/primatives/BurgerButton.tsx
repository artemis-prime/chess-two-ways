import React from 'react'

import { styled, type CSS } from '~/styles/stitches.config'

const StyledButton = styled('button', {

  //  border: '0.5px solid red',
  border: 'none',

  backgroundColor: 'transparent',
  cursor: 'pointer',
  width: '$header',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  color: 'inherit',
  borderRadius: '$rounded',

  fontSize: '24px',
  fontWeight: 700,

  '&:hover': {
    backgroundColor: '$menuHover'
  },
  '&:active': {
    backgroundColor: '$menuPressed'
  },

  variants: {
    toggledOn: {
      true: {
        backgroundColor: '$menuHover',
        '&:hover': {
          backgroundColor: '$menuSelectedHover'
        },
          // This has to be specified since 
          // this generates a more specific css selector
        '&:active': {
          backgroundColor: '$menuPressed'
        },
      }
    }
  }
})

const BurgerButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>
  toggledOn: boolean,
  className?: string
  css?: CSS
}> = ({
  onClick,
  toggledOn,
  className,
  css
}) => (
  <StyledButton onClick={onClick} toggledOn={toggledOn} className={className} css={css}>
    <span style={{fontSize: 'inherit', fontWeight: 'inherit', top: '1px', left: '-1px', display: 'block', position: 'relative' }}>{'\u2630'}</span>
  </StyledButton>
)

/*
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
<path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/>
</svg>
*/

export default BurgerButton
