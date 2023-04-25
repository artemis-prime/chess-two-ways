import type { ActionRecord } from '@artemis-prime/chess-core'

interface ConsoleMessage {
  message: string,
  type: string, 
  actionRecord?: ActionRecord,
  note?: any 
}

export { type ConsoleMessage as default }
