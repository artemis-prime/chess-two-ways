import React from 'react'
import { styled } from '~/styles/stitches.config'

import { useGame } from '~/services'
  
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

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalEvent = e
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => { 
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
        // Allow the same file to be selected consecutively. 
        // https://github.com/ngokevin/react-file-reader-input/issues/11
      originalEvent.target.value = ''
    }
    reader.onerror = (e: ProgressEvent<FileReader>) => {
      console.error("RestoreFromFileButton.readFile(): File Error!") 
    }
    reader.readAsText((e.target as any).files[0])
  }

  return (
    <MyLabel>
      <input type="file" onChange={readFile}/>
      {children}
    </MyLabel>
  )
}

export default RestoreFromFileButton
