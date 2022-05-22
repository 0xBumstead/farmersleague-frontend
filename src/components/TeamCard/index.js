import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper, StyledLink } from "./TeamCard.styles"
import { abi_LeagueTeam, abi_LeagueGame, contractAddresses } from "../../constants"

const TeamCard = ({ teamId, tokenId, clickable }) => {

    const dispatch = useNotification()
    const { isWeb3Enabled } = useMoralis()
    const navigate = useNavigate()

    const [nbOfPlayers, setNbOfPlayers] = useState(0)
    const [captainId, setCaptainId] = useState(0)
    const [inGameStatus, setInGameStatus] = useState("0")

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const leagueGameAddress = contractAddresses["LeagueGame"]
    const leagueTeamABI = abi_LeagueTeam
    const leagueGameABI = abi_LeagueGame

    const { runContractFunction: teamNbOfPlayers } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembers",
        params: { _teamId: teamId, _position: 0 }
    })

    const { runContractFunction: teamCaptain } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembers",
        params: { _teamId: teamId, _position: 1 }
    })

    const { runContractFunction: teamStatus } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 0 }
    })

    const updateUIValues = async () => {
        const nbOfPlayersFromCall = await teamNbOfPlayers()
        const captainIdFromCall = await teamCaptain()
        const inGameStatusFromCall = (await teamStatus()).toString()
        setNbOfPlayers(nbOfPlayersFromCall)
        setCaptainId(captainIdFromCall)
        setInGameStatus(inGameStatusFromCall)
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
        navigate("/teams/0")
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            {clickable ? (
                <StyledLink to={`/team/${teamId}/${tokenId}`}>
                    <h3>Team #{teamId}</h3>
                    <p>Number of players: {nbOfPlayers} </p>
                    <p>Captain: {captainId} </p>
                    <p>Status: {(inGameStatus === "0" || inGameStatus === undefined) ? ("Not ready yet") : ("Waiting for an opponent")} </p>
                </StyledLink>
            ) : (
                <>
                    <h3>Team #{teamId}</h3>
                    <p>Number of players: {nbOfPlayers} </p>
                    <p>Captain: {captainId} </p>
                    <p>Status: {(inGameStatus === "0" || inGameStatus === undefined) ? ("Not ready yet") : (inGameStatus)} </p>
                </>
            )}
            {tokenId > 0 ? (
                <ContractButton
                    abi={leagueTeamABI}
                    address={leagueTeamAddress}
                    functionName="applyForTeam"
                    params={{ _playerId: tokenId, _teamId: teamId }}
                    text="Apply for this team"
                    callback={txSuccess}
                    disabled={false}
                />
            ) : (
                <></>
            )}
        </Wrapper>
    )
}

TeamCard.propTypes = {
    teamId: PropTypes.number,
    tokenId: PropTypes.number,
    clickable: PropTypes.bool,
}

export default TeamCard