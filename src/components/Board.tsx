import React, {
  useEffect,
  useRef,
  useState
} from 'react'

import { observer } from 'mobx-react'

import { Square }   from '../domain/types'
import { useGame } from '../domain/GameProvider'
import { default as SquareComponent } from './Square'
import { useFeedback } from './Feedback'

const Board: React.FC<{}> = observer(() => {

  const feedback = useFeedback()
  const game = useGame()
  const intervalRef = useRef<any | undefined>(undefined)
  const [flashingOn, setFlashingOn] = useState<boolean>(true)

  const feedbackState = feedback.get()

  useEffect(() => {

    const clearMe = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined 
        setFlashingOn(true)
      }
    }
    if (feedbackState && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setFlashingOn((p) => (!p))
      }, 100)
    }
    else if (!feedbackState && intervalRef.current) {
      clearMe()
    }
    return clearMe
  }, [feedbackState])


  return (
    <main>
      {game.boardAsSquares().map((s: Square) => (
        <SquareComponent 
          flashingOn={flashingOn} 
          feedback={feedbackState} 
          square={s}
          key={`key-${s.rank}-${s.file}`}
        />
      ))}
    </main>
  )
})

export default Board
