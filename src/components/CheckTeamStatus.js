import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import GameSetCard from "./GameSetCard"
import { contractAddresses, abi_LeagueGame } from "../constants"

const CheckTeamStatus = ({ teamId, teamsList, currentBlock }) => {

    const { isWeb3Enabled } = useMoralis()

    const [status, setStatus] = useState("")

    const leagueGameABI = abi_LeagueGame
    const leagueGameAddress = contractAddresses["LeagueGame"]

    const { runContractFunction: getTeamStatus } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 0 }
    })

    const updateUIValues = async () => {
        const statusFromCall = await getTeamStatus()
        setStatus(statusFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (status.toString() === "3") {

        return (
            <>
                {teamsList.map(id => (
                    <GameSetCard key={id} challengedTeamId={teamId} challengingTeamId={id} currentBlock={currentBlock} />
                ))}
            </>
        )
    }
}

CheckTeamStatus.propTypes = {
    teamId: PropTypes.number,
    teamsList: PropTypes.array,
    currentBlock: PropTypes.number,
}

export default CheckTeamStatus

