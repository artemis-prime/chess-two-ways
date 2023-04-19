  // @ts-ignore
import React, { useRef } from 'react'

import { Button } from '~/primitives'
import { useGame } from '~/board/GameProvider'

const PersistToFileButton: React.FC<React.PropsWithChildren> = ({children}) => {

  const game = useGame()
  const aRef = useRef<HTMLAnchorElement>(null)
    
  const writeFile = () => {

    const gd = game.takeSnapshot()
    const gdjson = JSON.stringify(gd)
    const bytes = new TextEncoder().encode(gdjson)
    const blob = new Blob([bytes], {type: "application/json;charset=utf-8"})
    const dataURI = URL.createObjectURL(blob)
    if (aRef.current) {
      aRef.current.href = dataURI
      aRef.current.click()
    }
  }

  return (
    <>
      <Button onClick={writeFile}>{children}</Button>
      <a ref={aRef} download='game.json' hidden />
    </>
  )
}

export default PersistToFileButton
