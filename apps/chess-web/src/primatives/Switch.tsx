import React, { type PropsWithChildren } from 'react'
import { styled, type CSS } from '~/styles/stitches.config'

import SwitchFromLib from 'react-switch'

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

const Switch: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void,
  disabled?: boolean,
  css?: CSS
} & PropsWithChildren> = ({
  checked,
  onChange,
  children,
  disabled = false,
  css
}) => (

  <SwitchLabel css={css}>
    <span>{children}</span>
    <SwitchFromLib 
      className='my-switch' 
      checked={checked} 
      onChange={onChange}
      height={16} 
      width={44}
      handleDiameter={20}
      onColor='#005800'
      onHandleColor='#a76b37'
      activeBoxShadow='0 0 2px 3px rgba(100, 100, 100, 0.5)'
      disabled={disabled}
    />
  </SwitchLabel>
)

export default Switch
