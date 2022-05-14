import{ SquareState } from '../domain/SquareState'

export default interface DnDPawn {
  row: number
  col: number
  state: SquareState
}