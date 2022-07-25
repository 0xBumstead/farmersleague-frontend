import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis } from "react-moralis"
import PlayerCard from "./PlayerCard"
import { contractAddresses, abi_PlayerLoan } from "../constants"

const PlayerOnLoan = ({ tokenId, currentBlock }) => {

    const { user, isWeb3Enabled } = useMoralis()

    const [borrowerAddress, setBorrowerAddress] = useState("")
    const [loanTerm, setLoanTerm] = useState("")

    const playerLoanAddress = contractAddresses["PlayerLoan"]
    const playerLoanABI = abi_PlayerLoan
    const walletAddress = user.get("ethAddress").toString()

    const { runContractFunction: getLoanInfo } = useWeb3Contract({
        abi: playerLoanABI,
        contractAddress: playerLoanAddress,
        functionName: "loans",
        params: { _playerId: tokenId },
    })

    const updateUIValues = async () => {
        const loanInfoFromCall = await getLoanInfo()
        setBorrowerAddress(loanInfoFromCall.borrower.toString())
        setLoanTerm(loanInfoFromCall.term.toString())
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (borrowerAddress.toUpperCase() === walletAddress.toUpperCase() && loanTerm > currentBlock) {

        return (
            <PlayerCard tokenId={tokenId} clickable />
        )
    }
}

PlayerOnLoan.propTypes = {
    tokenId: PropTypes.number,
    currentBlock: PropTypes.number,
}

export default PlayerOnLoan