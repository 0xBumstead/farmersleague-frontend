import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MoralisProvider } from "react-moralis"

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://ita4ieozz87w.usemoralis.com:2053/server" appId="RiZEFr9kblECV26KyBwvlKJ1FadyPTHdyXn7owk1">
      <App />
    </MoralisProvider>
  </React.StrictMode>
)
