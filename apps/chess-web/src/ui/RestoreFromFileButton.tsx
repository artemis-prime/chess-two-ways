  // @ts-ignore
import React from 'react'
import { styled } from '~/style/stitches.config'

import { useGame } from '~/board/GameProvider'
  
const MyLabel = styled('label', {

  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline'
  },

  '& input[type="file"]': {
    display: 'none'
  }
})

const RestoreFromFileButton: React.FC<React.PropsWithChildren> = ({children}) => {

  const game = useGame()

  const readFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target?.result)
      if (text && typeof text === 'string') {
        const g: any = JSON.parse(text as string)
        if (g.artemisPrimeChessGame) {
          game.restoreFromSnapshot(g)
        }
        else {
          console.warn('Chess: unrecognized file format')
        }
      }
      else {
        console.warn('Chess: File parse error')
      }
    };
    reader.readAsText((e.target as any).files[0])
  }

  return (
    <MyLabel className="custom-file-upload">
      <input type="file" onChange={readFile}/>
      {children}
    </MyLabel>
  )
}

export default RestoreFromFileButton
