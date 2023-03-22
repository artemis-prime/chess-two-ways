import type Square from './Square'

const sameSquare = (s1: Square, s2: Square) => (
  (s1.file === s2.file) && (s1.rank === s2.rank)
)

export {
  sameSquare
}