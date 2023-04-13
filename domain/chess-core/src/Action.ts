type Action =
  'move' |
  'capture' |
  'promote' | 
  'castle' | 
  'capture-promote' // if a pawn captures and gets promoted in one move

const ACTIONS = ['move', 'capture', 'promote', 'castle', 'capture-promote'] as readonly Action[] 

export { type Action as default, ACTIONS }
