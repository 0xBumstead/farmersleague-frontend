import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import PropTypes from "prop-types"
import ContractButton from "../ContractButton"
import { Wrapper } from "./GameSetCard.styles"
import { contractAddresses, abi_LeagueGame } from "../../constants"

const GameSetCard = ({ challengedTeamId, challengingTeamId, currentBlock }) => {

    const dispatch = useNotification()
    const { isWeb3Enabled } = useMoralis()

    const [deadLine, setDeadLine] = useState(0)

    const leagueGameABI = abi_LeagueGame
    const leagueGameAddress = contractAddresses["LeagueGame"]

    const { runContractFunction: getChallengeDeadLine } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamChallenge",
        params: { _challengedTeamId: challengedTeamId, _challengingTeamId: challengingTeamId }
    })

    const updateUIValues = async () => {
        const deadLineFromCall = await getChallengeDeadLine()
        setDeadLine(deadLineFromCall)
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
    }
}

GameSetCard.propTypes = {
    challengedTeamId: PropTypes.number,
    challengingTeamId: PropTypes.number,
    currentBlock: PropTypes.number,
}

export default GameSetCard