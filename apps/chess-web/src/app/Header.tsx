import React from 'react'

import { styled, layout, deborder } from '~/styles/stitches.config'
import { BurgerButton, Flex, Button } from '~/primatives'
import { Logo, MainMenu, UndoRedoWidget } from '~/app/widgets'

const RightSpacer = styled('div', {
  width: '$header',
  height: '$header',

  '@virtualStaging': {
    width: '285px' // observation
  }
})

const Outer = styled('header', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',

  color: '$menuText',
  backgroundColor: '$menuBG',
  height: '$header',
  flex: 'none',
})

const Title = styled('h1', {
  m: 0,
  p: 0,
  lineHeight:  '$header',
  fontSize: '$header',
  fontFamily: '$header',
  alignSelf: 'center',
  ...deborder('red', 'header'),
  
  '@phonePortrait': {
    fontSize: '1rem', 
  },

  '@tabletPortrait': {
    fontSize: '1.9rem', 
  }
}) 

const LeftContainer = styled(Flex, {

})

const Header: React.FC<{
  menuOpen: boolean
  toggleMenu: () => void
}> = ({
  menuOpen,
  toggleMenu
}) => {
  
  return (
    <Outer>
      <Flex direction='row' justify='between' align='center' css={{
        width: layout.staging,
        m: '0 auto',
        ...deborder('gray', 'header')
      }}>
        <BurgerButton toggledOn={menuOpen} onClick={toggleMenu} css={{
          alignSelf: 'center', 
          width: 'initial', 
          height: '90%', 
          aspectRatio: 1, 
          '@virtualStaging': {display: 'none'},
        }}/>
        <LeftContainer 
          direction='row' 
          justify='start' 
          align='center' 
          css={{
            display: 'none', 
            '@virtualStaging': {display: 'flex'}
          }} 
        >
          <Logo css={{mr: '$1'}}/>
          <MainMenu />
        </LeftContainer>
        <Title>Chess Two Ways - Web</Title>
        <UndoRedoWidget />
      </Flex>
    </Outer>
  )
}

export default Header
