import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper } from "./Claim.styles"
import { contractAddresses, abi_ClaimKickToken, abi_KickToken } from "../../constants"

const Claim = ({ tokenId }) => {

    const dispatch = useNotification()
    const { Moralis, user, isWeb3Enabled } = useMoralis()

    const [kickBalance, setKickBalance] = useState(0)
    const [claimed, setClaimed] = useState(false)

    const claimAddress = contractAddresses["ClaimKickToken"]
    const kickTokenAddress = contractAddresses["KickToken"]
    const claimABI = abi_ClaimKickToken
    const kickTokenABI = abi_KickToken
    const walletAddress = user.get("ethAddress")

    const { runContractFunction: getKickBalance } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "balanceOf",
        params: { account: walletAddress },
    })

    const { runContractFunction: NFTClaim } = useWeb3Contract({
        abi: claimABI,
        contractAddress: claimAddress,
        functionName: "NFTClaim",
        params: { _playerId: tokenId },
    })

    const updateUIValues = async () => {
        const kickBalanceFromCall = Moralis.Units.FromWei(await getKickBalance())
        const claimedFromCall = await NFTClaim()
        setKickBalance(kickBalanceFromCall)
        setClaimed(claimedFromCall)
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

    return (
        <Wrapper>
            <h3>Claim KICK Tokens</h3>
            {claimed ? (
                <p>The player has already claimed its 100 tokens</p>
            ) : (
                <ContractButton
                    abi={claimABI}
                    address={claimAddress}
                    functionName="claim"
                    params={{ _playerId: tokenId }}
                    text="Claim 100 KICK"
                    callback={txSuccess}
                    disabled={false}
                />
            )}
            <p>You have : {kickBalance} KICK</p>
        </Wrapper>
    )
}

Claim.propTypes = {
    tokenId: PropTypes.number,
}

export default Claim