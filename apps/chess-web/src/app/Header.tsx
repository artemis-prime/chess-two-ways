import React from 'react'

import { styled, layout } from '~/styles/stitches.config'
import { BurgerButton, Flex } from '~/primatives'
import { Logo, MainMenu } from '~/app/widgets'

const FakeBurgerButton = styled('div', {
  width: '$header',
  height: '$header'
})

const Outer = styled('header', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',

  color: 'white',
  backgroundColor: '$menu',
  height: '$header',
})

const Title = styled('h1', {
  m: 0,
  p: 0,
  lineHeight:  '$header',
  fontSize: '$header',
  fontFamily: '$header',
  //border: '0.5px red solid',
  alignSelf: 'center',

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
        //border: '0.5px gray solid'
      }}>
        <BurgerButton toggledOn={menuOpen} onClick={toggleMenu} css={{
          alignSelf: 'center', 
          width: 'initial', 
          height: '90%', 
          aspectRatio: 1, 
          '@desktopConstrained': {display: 'none'}
        }}/>
        <LeftContainer direction='row' justify='start' align='center' css={{display: 'none', '@desktopConstrained': {display: 'flex'}}} >
          <Logo css={{mr: '$4'}}/>
          <MainMenu />
        </LeftContainer>
        <Title>Chess Two Ways - Web</Title>
        <FakeBurgerButton />
      </Flex>
    </Outer>
  )
}



export default Header
