import React from 'react'

import { styled, layout, deborder } from '~/styles/stitches.config'
import { BurgerButton, Flex, Button } from '~/primatives'
import { Logo, MainMenu, UndoRedoWidget } from '~/app/widgets'

const RightSpacer = styled('div', {
  width: '$header',
  height: '$header',

  '@headerStaging': {
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
})

const Title = styled('h1', {
  m: 0,
  p: 0,
  lineHeight:  '$header',
  fontSize: '$header',
  fontFamily: '$header',
  alignSelf: 'center',
  ...deborder('red', 'header')

  /*
  @include m.portrait-phone {
    font-size: 1.4rem; 
  }

  @include m.portrait-tablet {
    font-size: 1.9rem; 
  }
  */
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
          '@headerStaging': {display: 'none'},
          '@xl': {display: 'none'}
        }}/>
        <LeftContainer 
          direction='row' 
          justify='start' 
          align='center' 
          css={{
            display: 'none', 
            '@headerStaging': {display: 'flex'}
          }} 
        >
          <Logo css={{mr: '$1'}}/>
          <MainMenu />
        </LeftContainer>
        <Title>Chess Two Ways - Web</Title>
        <UndoRedoWidget buttonSize='large' menu strings={['Undo', 'Redo', '']}/>
      </Flex>
    </Outer>
  )
}

export default Header
