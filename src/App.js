import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useMoralis } from "react-moralis"
import Header from "./components/Header"
import Home from "./components/Home"
import { GlobalStyle } from "./GlobalStyle"

const supportedChain = "80001"

const App = () => {
  const { isWeb3Enabled, chainId } = useMoralis()

  return (
    <Router>
      <Header />
      {isWeb3Enabled ? (
        <div>
          {supportedChain === parseInt(chainId).toString() ? (
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          ) : (
            <div>Please switch to Polygon Mumbai Testnet</div>
          )}
        </div>
      ) : (
        <div>Please connect a wallet</div>
      )}
      <GlobalStyle />
    </Router>
  )
}

export default App