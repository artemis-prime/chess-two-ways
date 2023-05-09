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
  
  const onClick = () => {
    console.log("CLICKED")
  }

  return (
    <Drawer side='left' width={width} open={open} >
      <MenuRoot >
      <MenuSectionTitle>Direction</MenuSectionTitle>
      <MenuItem onClick={swapDirection} icon={ICONS.doubleVerticalArrow} >swap</MenuItem>
      <MenuCheckboxItem 
        checked={bo.autoOrientToCurrentTurn} 
        setChecked={bo.setAutoOrientToCurrentTurn}
        icon={ICONS.circularArrow}//'\u27F3'
      >auto-swap</MenuCheckboxItem>

      </MenuRoot>
    </Drawer>
  )
})

export default LeftDrawerMenu