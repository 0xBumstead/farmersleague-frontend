import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Button } from "web3uikit"
import PropTypes from "prop-types"
import { Wrapper } from "./GameCard.styles"
import { contractAddresses, abi_LeagueGame, abi_PlayerRate } from "../../constants"

const GameCard = ({ gameId, currentBlock, teamId }) => {

    const navigate = useNavigate()
    const { isWeb3Enabled } = useMoralis()

    const [gameEnding, setGameEnding] = useState(0)
    const [preRegistration, setPreRegistration] = useState(0)
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

    const { runContractFunction: getPreRegistration } = useWeb3Contract({
        abi: playerRateABI,
        contractAddress: playerRateAddress,
        functionName: "preRegistration",
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
        const preRegistrationFromCall = await getPreRegistration()
        const homeTeamFromCall = await getHomeTeam()
        const awayTeamFromCall = await getAwayTeam()
        setGameEnding(parseInt(gameTimeFromCall) + parseInt(gameDurationFromCall))
        setPreRegistration(parseInt(gameTimeFromCall) - parseInt(preRegistrationFromCall))
        setHomeTeam(homeTeamFromCall)
        setAwayTeam(awayTeamFromCall)
    }

    const handleSubmit = async () => {
        navigate(`/game/${gameId}/${homeTeam}/${awayTeam}`)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (gameEnding > currentBlock && preRegistration < currentBlock && homeTeam.toString() === teamId.toString()) {
        return (
            <Wrapper>
                <p>Teams #{homeTeam.toString()} and #{awayTeam.toString()} are engaged in a on-going game</p>
                {(preRegistration < currentBlock) ? (
                    <p>The pre-registration period is open</p>
                ) : (
                    <p>The game has already started</p>
                )}
                <Button
                    icon="externalLink"
                    onClick={handleSubmit}
                    text="Engage Players"
                    theme="primary"
                    type="button"
                />
            </Wrapper>
        )
    }
}

GameCard.propTypes = {
    gameId: PropTypes.number,
    currentBlock: PropTypes.number,
    teamId: PropTypes.number,
}

export default GameCard