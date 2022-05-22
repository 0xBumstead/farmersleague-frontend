import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useMoralis } from "react-moralis"
import Header from "./components/Header"
import Home from "./components/Home"
import Player from "./components/Player"
import Teams from "./components/Teams"
import Team from "./components/Team"
import SignUpTeam from "./components/SignUpTeam"
import ErrorMessage from "./components/ErrorMessage"
import { GlobalStyle } from "./GlobalStyle"

const App = () => {
  const { isWeb3Enabled, chainId } = useMoralis()
  const supportedChain = "80001"

  return (
    <Router>
      <Header />
      {isWeb3Enabled ? (
        <div>
          {supportedChain === parseInt(chainId).toString() ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:tabId" element={<Home />} />
              <Route path="/player/:objectId" element={<Player />} />
              <Route path="/teams/:objectId" element={<Teams />} />
              <Route path="/team/:objectId/:paramId" element={<Team />} />
              <Route path="/signup/:objectId" element={<SignUpTeam />} />
            </Routes>
          ) : (
            <>
              <ErrorMessage message="Please switch your wallet to the Polygon Mumbai Testnet" />
              <ErrorMessage message="To add the network to your wallet, you can use https://chainlist.org/chain/80001" />
              <ErrorMessage message="You can get TMATIC for free : https://faucet.polygon.technology" />
            </>
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