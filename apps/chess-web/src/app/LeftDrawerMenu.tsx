import React from 'react'
import { observer } from 'mobx-react'

import { styled } from '~/styles/stitches.config'

import { 
  Drawer, 
  MenuItem,
  MenuSectionTitle,
  MenuCheckboxItem
} from '~/primatives'

import ICONS from './UNICODE'
import { useBoardOrientation, useGame } from '~/services'

// Following this: 
// https://m3.material.io/components/navigation-drawer/specs

const MenuRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  w: '100%', 
  h: '100%', 
  p: '12px', // Spec: 28 to icon - 16 within button
  backgroundColor: '$menu', 
  color: 'white'
})


const LeftDrawerMenu: React.FC<{
  open: boolean
  width: number
}> = observer(({
  open,
  width
}) => {

  const bo = useBoardOrientation()
  const game = useGame()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }

  
  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 

  return (
    <Drawer side='left' width={width} open={open} >
      <MenuRoot >
        <MenuSectionTitle>Direction</MenuSectionTitle>
        <MenuItem onClick={swapDirection} icon={ICONS.twoVerticalArrows} >swap</MenuItem>
        <MenuCheckboxItem 
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn}
          icon={ICONS.clockwiseCircleArrow}
        >auto-swap</MenuCheckboxItem>
        <MenuSectionTitle>Game</MenuSectionTitle>
        {(game.playing) && (<>
          <MenuItem onClick={game.callADraw} icon={{icon: '=', style: {fontSize: '26px', fontWeight: 400}}}>call a draw</MenuItem>
          <MenuItem onClick={game.concede} icon={{icon: currentConcedes, style: {fontSize: '17px', fontWeight: 400}}}>{game.currentTurn} concedes</MenuItem>
          <MenuItem onClick={game.checkStalemate} icon={{icon: '$?', style: {fontSize: '20px', fontWeight: 500}}}>check for stalemate</MenuItem>
        </>)}
        <MenuItem onClick={game.reset} icon={{icon: ICONS.counterClockWiseArrow, style: {fontSize: '26px'}}}>reset</MenuItem>

      </MenuRoot>
    </Drawer>
  )
})

export default LeftDrawerMenu