import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification, Button } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper, Content } from "./IsCaptain.styles"
import { contractAddresses, abi_LeagueGame, abi_LeagueTeam, abi_KickToken } from "../../constants"

const IsCaptain = ({ tokenId, teamId, releasePrice, kickBalance, kickAllowance }) => {

    const dispatch = useNotification()
    const navigate = useNavigate()
    const { Moralis, isWeb3Enabled } = useMoralis()

    const [captainId, setCaptainId] = useState("0")
    const [inGameStatus, setInGameStatus] = useState("0")

    const leagueGameAddress = contractAddresses["LeagueGame"]
    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const kickTokenAddress = contractAddresses["KickToken"]
    const leagueGameABI = abi_LeagueGame
    const leagueTeamABI = abi_LeagueTeam
    const kickTokenABI = abi_KickToken

    const { runContractFunction: getCaptainId } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembers",
        params: { _teamId: teamId, _position: 1 },
    })

    const { runContractFunction: teamStatus } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 0 }
    })

    const { runContractFunction: payReleaseClause } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "payReleaseClause",
        params: { _playerId: tokenId },
    })

    const updateUIValues = async () => {
        const captainIdFromCAll = (await getCaptainId()).toString()
        const inGameStatusFromCall = (await teamStatus()).toString()
        setCaptainId(captainIdFromCAll)
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
        updateUIValues()
    }

    const approveSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        const releaseTx = await payReleaseClause()
        await releaseTx.wait(1)
        updateUIValues()
    }

    const handleSubmitReview = async () => {
        navigate(`/team/${teamId}/${tokenId}`)
    }

    const handleSubmitSignUp = async () => {
        navigate(`/signup/${teamId}`)
    }

    const handleSubmitChallenge = async () => {
        navigate(`/teams/0/${teamId}`)
    }

    const handleSubmitDecline = async () => {
        navigate(`/challenge/${teamId}/${tokenId}`)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <p>Player is the team's captain</p>
            <Content>
                {(tokenId.toString() === captainId) ? (
                    <>
                        <ContractButton
                            abi={leagueTeamABI}
                            address={leagueTeamAddress}
                            functionName="removeTeam"
                            params={{ _teamId: teamId }}
                            text="Remove team"
                            callback={txSuccess}
                            disabled={false}
                        />
                        <p></p>
                        <Button
                            icon="externalLink"
                            onClick={handleSubmitReview}
                            text="Review pending applications"
                            theme="primary"
                            type="button"
                        />
                        <p></p>
                        {(inGameStatus === "0") ? (
                            <Button
                                icon="externalLink"
                                onClick={handleSubmitSignUp}
                                text="Get ready for the game"
                                theme="primary"
                                type="button"
                            />
                        ) : ((inGameStatus == "1") ? (
                            <>
                                <p>The team is waiting for an opponent</p>
                                <ContractButton
                                    abi={leagueGameABI}
                                    address={leagueGameAddress}
                                    functionName="cancelSignUp"
                                    params={{ _teamId: teamId }}
                                    text="Cancel sign up"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                                <p></p>
                                <Button
                                    icon="externalLink"
                                    onClick={handleSubmitChallenge}
                                    text="Challenge another team"
                                    theme="primary"
                                    type="button"
                                />
                            </>
                        ) : ((inGameStatus == "2") ? (
                            <p>The team is challenging an opponent</p>
                        ) : ((inGameStatus == "3") ? (
                            <>
                                <p>The team is challenged by an opponent</p>
                                <Button
                                    icon="externalLink"
                                    onClick={handleSubmitDecline}
                                    text="Review the challenge"
                                    theme="primary"
                                    type="button"
                                />
                            </>
                        ) : (
                            <p>The team has a game set</p>
                        ))))}
                    </>
                ) : (
                    <>
                        {
                            (kickAllowance < releasePrice) ? (
                                <ContractButton
                                    abi={kickTokenABI}
                                    address={kickTokenAddress}
                                    functionName="approve"
                                    params={{ spender: leagueTeamAddress, amount: Moralis.Units.ETH(100000000) }}
                                    text="Pay the release clause"
                                    callback={approveSuccess}
                                    disabled={false}
                                />
                            ) : (
                                <ContractButton
                                    abi={leagueTeamABI}
                                    address={leagueTeamAddress}
                                    functionName="payReleaseClause"
                                    params={{ _playerId: tokenId }}
                                    text="Pay the release clause"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            )
                        }
                        <p>The release clause costs: {releasePrice} KICK</p>
                        <p>You have : {kickBalance}</p>
                    </>
                )}
            </Content>
        </Wrapper>
    )
}

IsCaptain.propTypes = {
    tokenId: PropTypes.number,
    teamId: PropTypes.number,
    releasePrice: PropTypes.number,
    kickBalance: PropTypes.number,
    kickAllowance: PropTypes.number
}

export default IsCaptain
