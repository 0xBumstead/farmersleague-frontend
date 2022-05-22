import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import ContractButton from "../ContractButton"
import IsCaptain from "../IsCaptain"
import PlayerApplication from "../PlayerApplication"
import { Wrapper } from "./PlayerTeam.styles"
import { contractAddresses, abi_LeagueTeam, abi_KickToken } from "../../constants"

const PlayerTeam = ({ tokenId }) => {

    const dispatch = useNotification()
    const { Moralis, user, isWeb3Enabled } = useMoralis()

    const [teamId, setTeamId] = useState(0)
    const [creationPrice, setCreationPrice] = useState(0)
    const [releasePrice, setReleasePrice] = useState(0)
    const [kickBalance, setKickBalance] = useState(0)
    const [kickAllowance, setKickAllowance] = useState(0)
    const [pendingApplication, setPendingApplication] = useState(0)

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const kickTokenAddress = contractAddresses["KickToken"]
    const leagueTeamABI = abi_LeagueTeam
    const kickTokenABI = abi_KickToken
    const walletAddress = user.get("ethAddress")

    const { runContractFunction: getTeamId } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "playersTeam",
        params: { _playerId: tokenId },
    })

    const { runContractFunction: getCreationPrice } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamCreationPrice",
    })

    const { runContractFunction: getReleasePrice } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "releasePrice",
    })

    const { runContractFunction: getKickBalance } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "balanceOf",
        params: { account: walletAddress },
    })

    const { runContractFunction: getKickAllowance } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "allowance",
        params: { owner: walletAddress, spender: leagueTeamAddress },
    })

    const { runContractFunction: getApplication } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "playersApplication",
        params: { _playerId: tokenId },
    })

    const { runContractFunction: createTeam } = useWeb3Contract({
        abi: leagueTeamABI,
        contractAddress: leagueTeamAddress,
        functionName: "createTeam",
        params: { _captainId: tokenId },
    })

    const updateUIValues = async () => {
        const teamIdFromCall = (await getTeamId()).toNumber()
        const creationPriceFromCall = Moralis.Units.FromWei(await getCreationPrice())
        const releasePriceFromCall = Moralis.Units.FromWei(await getReleasePrice())
        const kickBalanceFromCall = Moralis.Units.FromWei(await getKickBalance())
        const kickAllowanceFromCall = Moralis.Units.FromWei(await getKickAllowance())
        const pendingApplicationFromCall = (await getApplication()).toNumber()
        setTeamId(teamIdFromCall)
        setCreationPrice(creationPriceFromCall)
        setReleasePrice(releasePriceFromCall)
        setKickBalance(kickBalanceFromCall)
        setKickAllowance(kickAllowanceFromCall)
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

    const txSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUIValues()
    }

    const approveSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        const createTx = await createTeam()
        await createTx.wait(1)
        updateUIValues()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <h3>Player's team</h3>
            {(teamId === 0 || teamId === undefined) ? (
                <>
                    <p>Player is not in a team</p>
                    {(pendingApplication > 0) ? (
                        <></>
                    ) : (
                        <>
                            {(kickAllowance < creationPrice) ? (
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
                                    functionName="createTeam"
                                    params={{ _captainId: tokenId }}
                                    text="Create a team"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            )}
                            <p>Team creation price: {creationPrice} KICK</p>
                            <p>You have : {kickBalance}</p>
                        </>
                    )}
                    <PlayerApplication tokenId={tokenId} pendingApplication={pendingApplication} setPendingApplication={setPendingApplication} />
                </>
            ) : (
                <>
                    <p># {teamId}</p>
                    <IsCaptain tokenId={tokenId} teamId={teamId} releasePrice={releasePrice} kickBalance={kickBalance} kickAllowance={kickAllowance} />
                </>
            )
            }
        </Wrapper >
    )
}

PlayerTeam.propTypes = {
    tokenId: PropTypes.number,
}

export default PlayerTeam
