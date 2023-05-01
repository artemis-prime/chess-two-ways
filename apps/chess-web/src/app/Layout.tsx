import React, { type PropsWithChildren, useState } from 'react'

import Board from './Board'

import { 
  BurgerButton, 
  Drawer, 
  Flex, 
  FlexMain 
} from '~/primitives'

import Dash from './Dash'

import '~/styles/fonts.scss'
import '~/styles/main.scss'

const Side: React.FC<PropsWithChildren & { className?: string }> = ({children, className}) => (
  <Flex justify='center' align='center' className={className} >
    {children}
  </Flex>
)

const Layout: React.FC<{}> = () => {
  
  const [drawerOpen, setDrawerOpen] = useState<boolean >(false) 

  const toggleMenu = () => { setDrawerOpen((prev) => (!prev)) }
  
  return (
    <div className={`app drawer-state-${drawerOpen ? 'open' : 'closed'}`}>
      <header className="app-header">
        <div />
        <h1 className="app-header-text">Chess Two Ways - Web</h1>
        <div>
          <BurgerButton className='burger-button' onClick={toggleMenu} />
        </div>
      </header>
      <FlexMain direction='row' align='stretch' justify='center'>
        <Side className='side left'/>
        <Flex className='board-outer' justify='center' align='center'>
          <Board />
        </Flex>
        <Side className='side right'>
          <Dash />
        </Side>
        <Drawer open={drawerOpen} className='drawer'>
          <Dash />
        </Drawer>
      </FlexMain>
    </div>
  )
}

export default Layout
