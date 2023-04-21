interface BoardOrientation {
  whiteOnBottom: boolean,
  setWhiteOnBottom: (b: boolean) => void
  alternateBoard: boolean 
  setAlternateBoard: (b: boolean) => void
}

export {
  type BoardOrientation as default
}
