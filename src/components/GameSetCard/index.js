import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import PropTypes from "prop-types"
import ContractButton from "../ContractButton"
import { Wrapper } from "./GameSetCard.styles"
import { contractAddresses, abi_LeagueGame, abi_PlayerRate } from "../../constants"

const GameSetCard = ({ challengedTeamId, challengingTeamId, gameId, currentBlock }) => {

    const dispatch = useNotification()
    const { isWeb3Enabled } = useMoralis()

    const [deadLine, setDeadLine] = useState(0)
    const [gameTime, setGameTime] = useState(0)
    const [preRegistration, setPreRegistration] = useState(0)
    const [homeTeam, setHomeTeam] = useState("")
    const [awayTeam, setAwayTeam] = useState("")

    const leagueGameABI = abi_LeagueGame
    const leagueGameAddress = contractAddresses["LeagueGame"]
    const playerRateABI = abi_PlayerRate
    const playerRateAddress = contractAddresses["PlayerRate"]

    const { runContractFunction: getChallengeDeadLine } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamChallenge",
        params: { _challengedTeamId: challengedTeamId, _challengingTeamId: challengingTeamId }
    })

    const { runContractFunction: getGameTime } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "games",
        params: { _gameId: gameId, _rank: 0 }
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
        if (challengingTeamId > 0) {
            const deadLineFromCall = await getChallengeDeadLine()
            setDeadLine(deadLineFromCall)
        }
        if (gameId > 0) {
            const gameTimeFromCall = await getGameTime()
            const preRegistrationFromCall = await getPreRegistration()
            const homeTeamFromCall = await getHomeTeam()
            const awayTeamFromCall = await getAwayTeam()
            setGameTime(gameTimeFromCall)
            setPreRegistration(parseInt(gameTimeFromCall) - parseInt(preRegistrationFromCall))
            setHomeTeam(homeTeamFromCall)
            setAwayTeam(awayTeamFromCall)
        }
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

    if (deadLine > 0 && deadLine < currentBlock) {
        return (
            <Wrapper>
                <p>Teams #{challengingTeamId} and #{challengedTeamId} are waiting for a game</p>
                <ContractButton
                    abi={leagueGameABI}
                    address={leagueGameAddress}
                    functionName="requestGame"
                    params={{ _teamId: challengingTeamId, _opponentTeamId: challengedTeamId }}
                    text="Set the game"
                    callback={txSuccess}
                    disabled={false}
                />
            </Wrapper>
        )
    } else if (gameId > 0 && preRegistration > currentBlock && homeTeam.toString() === challengedTeamId.toString()) {
        return (
            <Wrapper>
                <p>Teams #{homeTeam.toString()} and #{awayTeam.toString()} have a game set</p>
                <p>The game starts at block n°{gameTime.toString()}</p>
                <p>Pre-registration opens at block n°{preRegistration}</p>
                <p>The current block number is {currentBlock}</p>
            </Wrapper>
        )
    }
}

GameSetCard.propTypes = {
    challengedTeamId: PropTypes.number,
    challengingTeamId: PropTypes.number,
    gameId: PropTypes.number,
    currentBlock: PropTypes.number,
}

export default GameSetCard