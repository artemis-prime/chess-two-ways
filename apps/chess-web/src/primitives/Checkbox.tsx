  // @ts-ignore
import React, { PropsWithChildren } from 'react'

import type { CSS } from '@stitches/react'

import { Box } from '~/primitives'

const Checkbox: React.FC<{
  checked: boolean,
  setChecked: (b: boolean) => void,
  css?: CSS
} & PropsWithChildren> = ({ 
  checked, 
  setChecked,
  children,
  css 
}) => {

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked)
  }

    // using visibility preserves layout in the DOM and avoids jumping.
  return (
    <Box css={css}>
      <label style={{cursor: 'pointer'}}>
        <input type='checkbox' checked={checked} onChange={onChange} hidden/>
        <span style={{marginRight: '4px'}}>[<span style={{visibility: (checked) ? 'visible' : 'hidden'}}>{String.fromCharCode(10004)}</span>]</span>
        <span className='label'>{children}</span>
      </label>
    </Box>
  );
}

export default Checkbox
