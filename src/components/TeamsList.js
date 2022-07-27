import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import Grid from "./Grid"
import CheckTeamStatus from "./CheckTeamStatus"
import { contractAddresses, abi_LeagueTeam } from "../constants"

const TeamsList = ({ currentBlock }) => {

    const { isWeb3Enabled } = useMoralis()

    const [teamsList, setTeamsList] = useState([])

    const leagueTeamABI = abi_LeagueTeam
    const leagueTeamAddress = contractAddresses["LeagueTeam"]

    const { runContractFunction: getNbOfTeams } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "nbOfTeams",
        params: {},
    })

    const updateUIValues = async () => {
        const nbOfTeamsFromCall = await getNbOfTeams()
        let teamsListFromCall = []
        for (let index = 1; index <= nbOfTeamsFromCall; index++) {
            teamsListFromCall.push(index)
        }
        setTeamsList(teamsListFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Grid header="Teams ready">
            {teamsList.map(id => (
                <CheckTeamStatus key={id} teamId={id} teamsList={teamsList} currentBlock={currentBlock} />
            ))}
        </Grid>
    )
}

TeamsList.propTypes = {
    currentBlock: PropTypes.number,
}

export default TeamsList