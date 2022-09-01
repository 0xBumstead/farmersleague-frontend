import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import PastGameCard from "./PastGameCard"
import { contractAddresses, abi_LeagueGame, abi_PlayerRate } from "../constants"

const CheckGameStatus = ({ gameId, currentBlock }) => {

    const { isWeb3Enabled } = useMoralis()

    const [gameEnding, setGameEnding] = useState(0)
    const [homeTeam, setHomeTeam] = useState("")
    const [awayTeam, setAwayTeam] = useState("")

    const leagueGameABI = abi_LeagueGame
    const leagueGameAddress = contractAddresses["LeagueGame"]
    const playerRateABI = abi_PlayerRate
    const playerRateAddress = contractAddresses["PlayerRate"]

    const { runContractFunction: getGameTime } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "games",
        params: { _gameId: gameId, _rank: 0 }
    })

    const { runContractFunction: getGameDuration } = useWeb3Contract({
        abi: playerRateABI,
        contractAddress: playerRateAddress,
        functionName: "gameDuration",
        params: {}
    })

    const { runContractFunction: getHomeTeam } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "games",
        params: { _gameId: gameId, _rank: 1 }
    })

    const { runContractFunction: getAwayTeam } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "games",
        params: { _gameId: gameId, _rank: 2 }
    })

    const updateUIValues = async () => {
        const gameTimeFromCall = await getGameTime()
        const gameDurationFromCall = await getGameDuration()
        const homeTeamFromCall = await getHomeTeam()
        const awayTeamFromCall = await getAwayTeam()
        setGameEnding(parseInt(gameTimeFromCall) + parseInt(gameDurationFromCall))
        setHomeTeam(homeTeamFromCall)
        setAwayTeam(awayTeamFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (gameEnding < currentBlock) {
        return (
            <PastGameCard gameId={gameId} homeTeam={parseInt(homeTeam)} awayTeam={parseInt(awayTeam)} />
        )
    }

}

CheckGameStatus.propTypes = {
    gameId: PropTypes.number,
    currentBlock: PropTypes.number,
}

export default CheckGameStatus

