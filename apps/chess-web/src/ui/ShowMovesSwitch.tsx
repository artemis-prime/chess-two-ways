  // @ts-ignore
  import React, { useState } from 'react'
import { styled } from '~/styles/stitches.config'

import Switch from 'react-switch'

const SwitchLabel = styled('label', {
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',
  gap: '0.5rem',
  '.my-switch': {
    display: 'block'
  },
  'span': {
    fontSize: '0.9rem',
    display: 'block'
  },
  '.react-switch-bg': {
    borderRadius: '5px !important',
    border: '0.5px #777 solid !important',
  },
  '.react-switch-handle': {
    border: '1.5px solid #777 !important'
  }
})

const ShowMovesSwitch: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({
  checked,
  onChange
}) => (

  <SwitchLabel >
    <span>show moves</span>
    <Switch 
      className='my-switch' 
      checked={checked} 
      onChange={onChange}
      height={16} 
      width={44}
      handleDiameter={20}
      onColor='#005800'
      onHandleColor='#a76b37'
      activeBoxShadow='0 0 2px 3px rgba(100, 100, 100, 0.5)'
    />
  </SwitchLabel>
)

export default ShowMovesSwitch
