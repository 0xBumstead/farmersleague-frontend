import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import GameSetCard from "./GameSetCard"
import GameCard from "./GameCard"
import GameFinishCard from "./GameFinishCard"
import { contractAddresses, abi_LeagueGame } from "../constants"

const CheckTeamStatus = ({ teamId, teamsList, currentBlock, gridHeader }) => {

    const { isWeb3Enabled } = useMoralis()

    const [status, setStatus] = useState("")
    const [gameId, setGameId] = useState(0)

    const leagueGameABI = abi_LeagueGame
    const leagueGameAddress = contractAddresses["LeagueGame"]

    const { runContractFunction: getTeamStatus } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 0 }
    })

    const { runContractFunction: getGameId } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 1 }
    })

    const updateUIValues = async () => {
        const statusFromCall = await getTeamStatus()
        const gameIdFromCall = await getGameId()
        setStatus(statusFromCall)
        setGameId(gameIdFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (status.toString() === "3" && gridHeader === "Teams Ready") {
        return (
            <>
                {teamsList.map(id => (
                    <GameSetCard key={id} challengedTeamId={teamId} challengingTeamId={id} gameId={0} currentBlock={currentBlock} />
                ))}
            </>
        )
    }

    if (status.toString() === "4" && gridHeader === "Up-coming Games") {
        return (
            <GameSetCard key="a" challengedTeamId={teamId} challengingTeamId={0} gameId={parseInt(gameId)} currentBlock={currentBlock} />
        )
    }

    if (status.toString() === "4" && gridHeader === "On-going Games") {
        return (
            <GameCard gameId={parseInt(gameId)} currentBlock={currentBlock} teamId={teamId} />
        )
    }

    if (status.toString() === "4" && gridHeader === "Games To Finish") {
        return (
            <GameFinishCard gameId={parseInt(gameId)} currentBlock={currentBlock} teamId={teamId} />
        )
    }
}

CheckTeamStatus.propTypes = {
    teamId: PropTypes.number,
    teamsList: PropTypes.array,
    currentBlock: PropTypes.number,
    gridHeader: PropTypes.string,
}

export default CheckTeamStatus

