import { makeObservable, observable, action } from 'mobx'
interface MenuState {
  visible: boolean,
  setVisible: (b: boolean) => void
}

class MenuStateImpl implements MenuState {
  
  visible: boolean = false
  
  constructor() {
    makeObservable(this, {
      visible: observable,
      setVisible: action.bound 
    })
  }

  setVisible(b: boolean) { this.visible = b }
}

export { type MenuState as default, MenuStateImpl}
