import React from 'react'

import { styled, type CSS } from '~/styles/stitches.config'

const StyledButton = styled('button', {

  //  border: '0.5px solid red',
  border: 'none',
  flex: 'none',

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

    // https://stackoverflow.com/questions/16056591/font-scaling-based-on-size-of-container#comment29460412_19814948
  containerType: 'size',

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

const StyledSpan = styled('span', {
  fontSize: '63cqh', 
  fontWeight: 700, 
  top: '1px', 
  left: '-1px', 
  display: 'block', 
  position: 'relative' 
})

const BurgerButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>
  toggledOn: boolean,
  css?: CSS
}> = ({
  onClick,
  toggledOn,
  css
}) => (
  <StyledButton onClick={onClick} toggledOn={toggledOn} css={css}>
    <StyledSpan>{'\u2630'}</StyledSpan>
  </StyledButton>
)

/*
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
<path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/>
</svg>
*/

export default BurgerButton
