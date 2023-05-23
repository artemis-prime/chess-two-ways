interface ChessboardOrientation {
  whiteOnBottom: boolean,
  setWhiteOnBottom: (b: boolean) => void
  autoOrientToCurrentTurn: boolean,
  setAutoOrientToCurrentTurn: (b: boolean) => void 
}

export { type ChessboardOrientation as default }
