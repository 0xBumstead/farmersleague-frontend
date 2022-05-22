import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification, Button } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper } from "./PlayerApplication.styles"
import { contractAddresses, abi_LeagueTeam } from "../../constants"

const PlayerApplication = ({ tokenId, pendingApplication, setPendingApplication }) => {

    const dispatch = useNotification()
    const navigate = useNavigate()
    const { isWeb3Enabled } = useMoralis()

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const leagueTeamABI = abi_LeagueTeam

    const { runContractFunction: getApplication } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "playersApplication",
        params: { _playerId: tokenId },
    })

    const updateUIValues = async () => {
        const pendingApplicationFromCall = (await getApplication()).toNumber()
        setPendingApplication(pendingApplicationFromCall)
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

    const handleSubmit = async () => {
        navigate(`/teams/${tokenId}`)
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

    return (
        <Wrapper>
            <h3>Player's pending application</h3>
            {(pendingApplication === 0 || pendingApplication === undefined) ? (
                <>
                    <p>Player has no pending application</p>
                    <Button
                        icon="externalLink"
                        onClick={handleSubmit}
                        text="Apply for a team"
                        theme="primary"
                        type="button"
                    />
                </>
            ) : (
                <>
                    <p>Player has applied for team #{pendingApplication}</p>
                    <ContractButton
                        abi={leagueTeamABI}
                        address={leagueTeamAddress}
                        functionName="cancelApplication"
                        params={{ _playerId: tokenId, _teamId: pendingApplication }}
                        text="Cancel Application"
                        callback={txSuccess}
                        disabled={false}
                    />
                </>
            )}
        </Wrapper>
    )
}

PlayerApplication.propTypes = {
    tokenId: PropTypes.number,
    pendingApplication: PropTypes.number
}

export default PlayerApplication
