import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useMoralis } from "react-moralis"
import Header from "./components/Header"
import Home from "./components/Home"
import ErrorMessage from "./components/ErrorMessage"
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
            <ErrorMessage message="Please switch your wallet to the Polygon Mumbai Testnet" />
          )}
        </div>
      ) : (
        <ErrorMessage message="Please connect a wallet" />
      )}
      <GlobalStyle />
    </Router>
  )
}

export default App