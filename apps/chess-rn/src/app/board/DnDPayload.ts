import { 
  type Position, 
  type Piece, 
} from '@artemis-prime/chess-core'


interface DnDPayload {
  piece: Piece
  from: Position
}

export default DnDPayload
