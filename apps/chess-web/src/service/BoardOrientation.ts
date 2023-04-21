interface BoardOrientation {
  whiteOnBottom: boolean,
  setWhiteOnBottom: (b: boolean) => void
  autoOrientToCurrentTurn: boolean,
  setAutoOrientToCurrentTurn: (b: boolean) => void 
}

export { type BoardOrientation as default }
