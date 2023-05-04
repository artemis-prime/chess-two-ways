import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

document.addEventListener("contextmenu", (e) => {e.preventDefault()});

  // Keep in mind!: 
  // https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

