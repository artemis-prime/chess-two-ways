// @ts-ignore
import React from 'react'

const BurgerButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}> = ({
  onClick,
  className
}) => (
  <button onClick={onClick} className={className}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/>
  </svg>
  </button>
)

export default BurgerButton
