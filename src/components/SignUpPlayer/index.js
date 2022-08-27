import React, { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import { Select } from "web3uikit"
import Grid from "../Grid"
import PlayerCard from "../PlayerCard"
import { Wrapper, Content } from "./SignUpPlayer.styles"
import { contractAddresses, abi_LeagueTeam, layoutNumber, positionsNumber, layoutsPositions } from "../../constants"

const SignUpPlayer = ({ gameId, teamId, isHome, teamLayout, playersSigned }) => {

    const { isWeb3Enabled } = useMoralis()

    const [teamMembersAvailable, setTeamMembersAvailable] = useState([])
    const [positionsAvailable, setPositionsAvailable] = useState([])
    const [position, setPosition] = useState(0)

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const leagueTeamABI = abi_LeagueTeam
    const layoutName = layoutNumber["names"][teamLayout]
    const layoutImg = require("../../images/" + layoutNumber["png"][teamLayout])

    const { runContractFunction: getTeamPlayers } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembersArray",
        params: { _teamId: teamId }
    })

    const updateUIValues = async () => {
        let teamMembersSigned = []
        let teamMembersNotSigned = []
        let positionsAvailableFromLoop = []

        for (let index = 0; index < 16; index++) {
            if (playersSigned[index] === 0) {
                let positionName = positionsNumber[layoutsPositions.layouts[teamLayout].positions[index]]
                positionsAvailableFromLoop.push({ id: index, label: (index + 1) + " - " + positionName })
            } else {
                teamMembersSigned.push(playersSigned[index])
            }
        }

        const teamMembersFromCall = await getTeamPlayers()

        for (let index = 0; index < teamMembersFromCall.length; index++) {
            if (!teamMembersSigned.includes(teamMembersFromCall[index]) & teamMembersFromCall[index] !== 0) {
                teamMembersNotSigned.push(teamMembersFromCall[index])
            }
        }

        setTeamMembersAvailable(teamMembersNotSigned)
        setPositionsAvailable(positionsAvailableFromLoop)
    }

    const handleSelect = (event) => {
        setPosition(event.id)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, playersSigned])

    return (
        <Wrapper>
            {isHome ? (
                <h1>Home Team : #{teamId}</h1>
            ) : (
                <h1>Away Team : #{teamId}</h1>
            )}
            <h3>Team layout : {layoutName}</h3>
            <img src={layoutImg} alt="Team layout" />
            <Content>
                <h3>Positions Available to Select</h3>
                <Select
                    label="Position"
                    onBlurTraditional={handleSelect}
                    onChange={handleSelect}
                    onChangeTraditional={handleSelect}
                    options={positionsAvailable}
                />
                <div></div>
            </Content>
            {isHome ? (
                <Grid header="Players Available">
                    {teamMembersAvailable.map(id => (
                        <PlayerCard key={id} tokenId={id} teamId={teamId} gameId={gameId} position={position} />
                    ))}
                </Grid>
            ) : (
                <Grid header="Players Available">
                    {teamMembersAvailable.map(id => (
                        <PlayerCard key={id} tokenId={id} teamId={teamId} gameId={gameId} position={position + 16} />
                    ))}
                </Grid>
            )}
        </Wrapper>
    )
}

SignUpPlayer.propTypes = {
    gameId: PropTypes.number,
    teamId: PropTypes.number,
    isHome: PropTypes.bool,
    teamLayout: PropTypes.number,
    playersSigned: PropTypes.arrayOf(PropTypes.number)
}

export default SignUpPlayer

