  // @ts-ignore
import React, { useEffect, useState, useCallback, HTMLInputElement } from 'react'
import { observer } from 'mobx-react'
import { useDrag, DragPreviewImage } from 'react-dnd'

import { Canvg, presets as canvgpresets } from 'canvg'
import { useElementSize } from 'usehooks-ts'

import type { Square, Piece } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import { type DnDPiece, DND_ITEM_NAME } from './DnDPiece'
import registry from './pieceRegistry'
export interface SpecificPieceProps {
  size?: string 
}

const PieceComponent: React.FC<{
  piece: Piece,
  square: Square
}> = observer(({
  piece,
  square
}) => {
  const game = useGame()
  const [squareRef, { width, height }] = useElementSize()
  const [{ isDragging, canDrag }, drag, previewConnect] = useDrag(() => ({
    type: DND_ITEM_NAME,
    item: {piece, from: square} as DnDPiece,
    canDrag: (monitor) => (game.currentTurn === piece.color),
    end: (item, monitor) => { game.endResolution() },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      canDrag: !!monitor.canDrag()
    }),
  }), [square, piece])

  const [dragImageBase64, setDragImageBase64] = useState<string>('')

  /*
  useEffect(() => {
    const getSvgString = () => (
      "<svg width='65px' height='65px' viewBox='0 -50 700 700' xmlns='http://www.w3.org/2000/svg'><path d='M467.6 446.32h-14c-15.121-50.961-34.16-122.64-47.039-198.24h31.359c20.16 0 36.398-16.238 36.398-36.398s-16.238-36.398-36.398-36.398h-28c19.602-16.801 31.922-41.441 31.922-69.441 0-50.961-41.441-91.84-91.84-91.84-50.402-.004-91.844 41.438-91.844 91.836 0 28 12.879 52.641 31.922 69.441h-28c-20.16 0-36.398 16.238-36.398 36.398 0 20.16 16.238 36.398 36.398 36.398h31.918c-12.879 75.602-31.922 147.28-47.039 198.24h-14c-26.879 0-48.719 21.84-48.719 48.719v35.281c0 8.398 6.719 15.68 15.68 15.68h300.72c8.398 0 15.68-6.719 15.68-15.68v-35.281c-.559-26.875-22.398-48.715-48.719-48.715z' /></svg>"
    )
    const getImageBase64 = async () => {
      const preset = canvgpresets.offscreen()
 
      //const canvas = document.querySelector('canvas');
      const canvas = new OffscreenCanvas(65, 65)
      const ctx = canvas!.getContext('2d');
    
      const canv = await Canvg.fromString(ctx!, getSvgString(), preset);
      const w = width ? (width * 0.8) : 65
      canv.resize(w, w, true)
      canv.render()
      const blob = await canvas.convertToBlob()
      const base64 = URL.createObjectURL(blob)
      setDragImageBase64(base64)
    }
    getImageBase64()
  })
  */

  const SpecificPiece = registry.get(piece.type) as React.ComponentType<SpecificPieceProps>
  const size = piece.type === 'pawn' ? '80%' :'94%'

  return (
    <div 
      ref={drag}
      style={{
        opacity: (isDragging ? 0.5 : 1), 
        cursor: canDrag ? (isDragging ? 'move' : 'pointer') : 'default',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
//        border: '0.5px red solid'
      }}
      className={`piece ${piece!.color}-piece`}
    >
        {/*dragImageBase64 && <DragPreviewImage connect={previewConnect} src={dragImageBase64} />*/}
        <SpecificPiece size={size} />
      </div>

  )
})

export default PieceComponent
