import React, { useState } from 'react'

import { useResizeDetector } from 'react-resize-detector'

import { styled } from '~/styles/stitches.config'
import { Flex } from '~/primatives'

import Dash from './Dash'
import Header from './Header'
import Board from './Board'
import LeftDrawerMenu from './LeftDrawerMenu'

import '~/styles/fonts.scss'
import '~/styles/body.scss'

const Main = styled('main', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  width: '100%',
  height: '95vh',
  p: '$2',
})

const Wing = styled('div', {
  flex: '1 1 0' 
})

const menuDrawerWidth = (w: number | undefined) => (
  w ? Math.min((0.3 * w), 350) : 350
)

const Layout: React.FC<{}> = () => {
  
  const [drawerOpen, setDrawerOpen] = useState<boolean >(false) 
  const { width, ref } = useResizeDetector()

  const toggleMenu = () => { setDrawerOpen((prev) => (!prev)) }
  
  return (
    <div ref={ref}>
      <Header menuOpen={drawerOpen} toggleMenu={toggleMenu} />
      <Main>
        <Wing className='side left'/>
        <Flex css={{flex: '2 0 0'}} justify='center' align='start'>
          <Board />
        </Flex>
        <Wing className='side right'>
          <Dash />
        </Wing>
        <LeftDrawerMenu width={menuDrawerWidth(width)} open={drawerOpen} />
      </Main>
    </div>
  )
}

export default Layout
