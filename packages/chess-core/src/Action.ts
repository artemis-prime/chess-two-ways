type Action =
  'move' |
  'capture' |
  'promote' | 
  'castle' | 
  'capture-promote' // if a pawn captures and gets promoted in one move

export { type Action as default }
