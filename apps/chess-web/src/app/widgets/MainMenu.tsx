import React from 'react'
import { observer } from 'mobx-react'

import type { GameSnapshot } from '@artemis-prime/chess-core'

import {type CSS } from '~/styles/stitches.config'
import { useBoardOrientation, useGame, useSnapshotPersistence } from '~/services'
import type { IconAndStyles } from '~/primatives'

import {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger, 
  MenubarPopup,
  MenubarSeparator,
  MenubarItem,
  MenubarCheckboxItem,
} from './menu/main'

import menuIcons from './menu/menuIcons'

const AppMenubar: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const bo = useBoardOrientation()
  const sp = useSnapshotPersistence()
  const game = useGame()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  const saveSnapshot = () => {
    const gs = game.takeSnapshot()
    sp.save(gs, 'game.json')
  }
  
  const restoreSnapshot = () => { 
    sp.get(
      (snapshot: GameSnapshot) => { game.restoreFromSnapshot(snapshot) },
      (error: string) => { console.warn(error) }
    )
  }

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <MenubarRoot css={css}>
      <MenubarMenu>
        <MenubarTrigger>Game</MenubarTrigger>
        <MenubarPopup>
        {(game.playing) && (<>
          <MenubarItem onClick={game.callADraw} icon={menuIcons.draw}>call a draw</MenubarItem>
          <MenubarItem onClick={game.concede} icon={{icon: currentConcedes, style: (menuIcons.concede as IconAndStyles).style}}>{game.currentTurn} concedes</MenubarItem>
          <MenubarItem onClick={game.checkStalemate} icon={menuIcons.stalemate}>check for stalemate</MenubarItem>
        </>)}
          <MenubarItem onClick={game.reset} icon={menuIcons.reset}>reset</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={saveSnapshot} icon={menuIcons.saveGame} >save game...</MenubarItem>
          <MenubarItem onClick={restoreSnapshot} icon={menuIcons.restoreGame} >restore game...</MenubarItem>
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