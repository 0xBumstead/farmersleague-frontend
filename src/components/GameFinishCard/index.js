import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import PropTypes from "prop-types"
import ContractButton from "../ContractButton"
import { Wrapper } from "./GameFinishCard.styles"
import { contractAddresses, abi_LeagueGame, abi_PlayerRate } from "../../constants"

const GameFinishCard = ({ gameId, currentBlock, teamId }) => {

    const dispatch = useNotification()
    const { isWeb3Enabled } = useMoralis()

    const [gameEnding, setGameEnding] = useState(0)
    const [homeTeam, setHomeTeam] = useState(0)
    const [awayTeam, setAwayTeam] = useState(0)

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
        setHomeTeam(parseInt(homeTeamFromCall))
        setAwayTeam(parseInt(awayTeamFromCall))
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const txSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUIValues()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (gameEnding < currentBlock && homeTeam.toString() === teamId.toString()) {
        return (
            <Wrapper>
                <p>Teams #{homeTeam} and #{awayTeam} are waiting for their result</p>
                <ContractButton
                    abi={leagueGameABI}
                    address={leagueGameAddress}
                    functionName="finishGame"
                    params={{ _gameId: gameId }}
                    text="Get the result"
                    callback={txSuccess}
                    disabled={false}
                />
            </Wrapper>
        )
    }
}

GameFinishCard.propTypes = {
    gameId: PropTypes.number,
    currentBlock: PropTypes.number,
    teamId: PropTypes.number,
}

export default GameFinishCard