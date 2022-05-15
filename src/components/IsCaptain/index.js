import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification, Button } from "web3uikit"
import ContractButton from "../ContractButton"
import { contractAddresses, abi_LeagueTeam, abi_KickToken } from "../../constants"
import { Wrapper, Content } from "./IsCaptain.styles"

const IsCaptain = ({ tokenId, teamId }) => {

    const dispatch = useNotification()
    const navigate = useNavigate()
    const { Moralis, user, isWeb3Enabled } = useMoralis()

    const [releasePrice, setReleasePrice] = useState(0)
    const [kickAllowance, setKickAllowance] = useState(0)
    const [captainId, setCaptainId] = useState("0")

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const kickTokenAddress = contractAddresses["KickToken"]
    const leagueTeamABI = abi_LeagueTeam
    const kickTokenABI = abi_KickToken
    const walletAddress = user.get("ethAddress")

    const { runContractFunction: getReleasePrice } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "releasePrice",
    })

    const { runContractFunction: getCaptainId } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembers",
        params: { _teamId: teamId, _position: 1 },
    })

    const { runContractFunction: getKickAllowance } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "allowance",
        params: { owner: walletAddress, spender: leagueTeamAddress },
    })

    const { runContractFunction: payReleaseClause } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "payReleaseClause",
        params: { _playerId: tokenId },
    })

    const updateUIValues = async () => {
        const releasePriceFromCall = Moralis.Units.FromWei(await getReleasePrice())
        const kickAllowanceFromCall = Moralis.Units.FromWei(await getKickAllowance())
        const captainIdFromCAll = (await getCaptainId()).toString()
        setReleasePrice(releasePriceFromCall)
        setKickAllowance(kickAllowanceFromCall)
        setCaptainId(captainIdFromCAll)
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

    const handleSubmit = async () => {
        navigate(`/team/${teamId}/${tokenId}`)
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
                {(tokenId === captainId) ? (
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
                            onClick={handleSubmit}
                            text="Review pending applications"
                            theme="primary"
                            type="button"
                        />
                    </>
                ) : (
                    (kickAllowance < releasePrice) ? (
                        <ContractButton
                            abi={kickTokenABI}
                            address={kickTokenAddress}
                            functionName="approve"
                            params={{ spender: leagueTeamAddress, amount: Moralis.Units.ETH(100000000) }}
                            text="Create a team"
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
                )}
            </Content>
        </Wrapper>
    )
}

IsCaptain.propTypes = {
    tokenId: PropTypes.string,
    teamId: PropTypes.number
}

export default IsCaptain
