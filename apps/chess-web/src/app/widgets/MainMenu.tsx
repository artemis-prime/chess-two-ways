import React from 'react'
import { observer } from 'mobx-react'

import {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger, 
  MenubarPopup,
  RightSlot,
  MenubarSeparator,
  MenubarItem,
  MenubarCheckboxItem,
} from './menu/main'

import { styled, type CSS, common } from '~/styles/stitches.config'
import { useBoardOrientation, useGame } from '~/services'
import ICONS from './UNICODE'

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
          <MenubarItem onClick={game.callADraw} icon={{icon: '=', style: {fontSize: '26px', fontWeight: 400}}}>call a draw</MenubarItem>
          <MenubarItem onClick={game.concede} icon={{icon: currentConcedes, style: {fontSize: '17px', fontWeight: 400}}}>{game.currentTurn} concedes</MenubarItem>
          <MenubarItem onClick={game.checkStalemate} icon={{icon: '$?', style: {fontSize: '20px', fontWeight: 500}}}>check for stalemate</MenubarItem>
          <MenubarItem onClick={game.reset} icon={{icon: ICONS.counterClockWiseArrow, style: {fontSize: '26px'}}}>reset</MenubarItem>
          <MenubarSeparator />
          <MenubarItem icon={{icon: '\u{1F4E5}\uFE0E', style: {fontSize: '19px'}}} >save game...</MenubarItem>
          <MenubarItem icon={{icon: '\u{1F4E4}\uFE0E', style: {fontSize: '19px'}}} >restore game...</MenubarItem>
        </MenubarPopup>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Direction</MenubarTrigger>
        <MenubarPopup>
          <MenubarItem onClick={swapDirection} disabled={bo.autoOrientToCurrentTurn} icon={ICONS.twoVerticalArrows} >swap</MenubarItem>
          <MenubarCheckboxItem
            checked={bo.autoOrientToCurrentTurn} 
            onCheckedChange={bo.setAutoOrientToCurrentTurn}
            icon={ICONS.clockwiseCircleArrow}
          >auto-swap</MenubarCheckboxItem>
        </MenubarPopup>
      </MenubarMenu>
    </MenubarRoot>
  )
})

export default AppMenubar