import React from 'react'
import { observer } from 'mobx-react'

import {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger, 
  MenubarPopup,
  MenubarSeparator,
  MenubarItem,
  MenubarCheckboxItem,
} from './menu/main'

import type { IconAndStyles } from '~/primatives'

import {type CSS } from '~/styles/stitches.config'
import { useBoardOrientation, useGame } from '~/services'

import menuIcons from './menu/menuIcons'

const AppMenubar: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const bo = useBoardOrientation()
  const game = useGame()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }
  
  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <MenubarRoot css={css}>
      <MenubarMenu>
        <MenubarTrigger>Game</MenubarTrigger>
        <MenubarPopup>
          <MenubarItem onClick={game.callADraw} icon={menuIcons.draw}>call a draw</MenubarItem>
          <MenubarItem onClick={game.concede} icon={{icon: currentConcedes, style: (menuIcons.concede as IconAndStyles).style}}>{game.currentTurn} concedes</MenubarItem>
          <MenubarItem onClick={game.checkStalemate} icon={menuIcons.stalemate}>check for stalemate</MenubarItem>
          <MenubarItem onClick={game.reset} icon={menuIcons.reset}>reset</MenubarItem>
          <MenubarSeparator />
          <MenubarItem icon={menuIcons.saveGame} >save game...</MenubarItem>
          <MenubarItem icon={menuIcons.restoreGame} >restore game...</MenubarItem>
        </MenubarPopup>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Direction</MenubarTrigger>
        <MenubarPopup>
          <MenubarItem onClick={swapDirection} disabled={bo.autoOrientToCurrentTurn} icon={menuIcons.swap} >swap</MenubarItem>
          <MenubarCheckboxItem
            checked={bo.autoOrientToCurrentTurn} 
            onCheckedChange={bo.setAutoOrientToCurrentTurn}
            icon={menuIcons.autoSwap}
          >auto-swap</MenubarCheckboxItem>
        </MenubarPopup>
      </MenubarMenu>
    </MenubarRoot>
  )
})

export default AppMenubar