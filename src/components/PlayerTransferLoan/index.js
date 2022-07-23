import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useWeb3Contract, useMoralis, useMoralisWeb3Api } from "react-moralis"
import { useNotification, Input } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper } from "./PlayerTransferLoan.styles"
import { contractAddresses, abi_PlayerTransfer, abi_PlayerLoan, abi_VerifiableRandomFootballer } from "../../constants"

const PlayerTransferLoan = ({ tokenId }) => {

    const dispatch = useNotification()
    const { Moralis, isWeb3Enabled } = useMoralis()
    const web3Api = useMoralisWeb3Api({})

    const [transferStatus, setTransferStatus] = useState(0)
    const [loanStatus, setLoanStatus] = useState("not on loan")
    const [loanListingStatus, setLoanListingStatus] = useState("not listed for loan")
    const [transferPrice, setTransferPrice] = useState(0)
    const [loanPrice, setLoanPrice] = useState(0)
    const [loanDuration, setLoanDuration] = useState(0)
    const [loanBorrower, setLoanBorrower] = useState("")
    const [loanTerm, setLoanTerm] = useState(0)
    const [tokenApproval, setTokenApproval] = useState("0x0000000000000000000000000000000000000000")

    const playerTransferAddress = contractAddresses["PlayerTransfer"]
    const playerTransferABI = abi_PlayerTransfer
    const playerLoanAddress = contractAddresses["PlayerLoan"]
    const playerLoanABI = abi_PlayerLoan
    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const verifiableRandomFootballerABI = abi_VerifiableRandomFootballer

    const { runContractFunction: getTransferStatus } = useWeb3Contract({
        abi: playerTransferABI,
        contractAddress: playerTransferAddress,
        functionName: "playersForTransfer",
        params: { _playerId: tokenId },
    })

    const { runContractFunction: getTokenApproval } = useWeb3Contract({
        abi: verifiableRandomFootballerABI,
        contractAddress: verifiableRandomFootballerAddress,
        functionName: "getApproved",
        params: { tokenId: tokenId },
    })

    const { runContractFunction: getLoanListing } = useWeb3Contract({
        abi: playerLoanABI,
        contractAddress: playerLoanAddress,
        functionName: "playersForLoan",
        params: { _playerId: tokenId }
    })

    const { runContractFunction: getLoanStatus } = useWeb3Contract({
        abi: playerLoanABI,
        contractAddress: playerLoanAddress,
        functionName: "loans",
        params: { _playerId: tokenId }
    })

    const updateUIValues = async () => {
        const transferStatusFromCall = await getTransferStatus()
        const tokenApprovalFromCall = await getTokenApproval()
        const loanListingFromCall = await getLoanListing()
        const loanStatusFromCall = await getLoanStatus()
        const currentBlockFromCall = await web3Api.native.getDateToBlock({
            chain: "mumbai",
            date: Date(),
        })
        setTransferStatus(transferStatusFromCall)
        setTokenApproval(tokenApprovalFromCall)
        setLoanDuration(loanListingFromCall.duration.toString())
        setLoanPrice(loanListingFromCall.price.toString())
        setLoanBorrower(loanStatusFromCall.borrower.toString())
        setLoanTerm(loanStatusFromCall.term.toString())
        if (loanListingFromCall.duration.toString() === "0") {
            setLoanListingStatus("not listed for loan")
        } else {
            setLoanListingStatus("listed for loan")
        }
        if (loanStatusFromCall.borrower.toString() !== "0" && loanStatusFromCall.term.toString() < currentBlockFromCall) {
            setLoanStatus("on loan")
        } else {
            setLoanStatus("not on loan")
        }
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

    const handleTransferPriceInput = (event) => {
        setTransferPrice(event.target.value)
    }

    const handleLoanPriceInput = (event) => {
        setLoanPrice(event.target.value)
    }

    const handleLoanDurationInput = (event) => {
        setLoanDuration(event.target.value)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <h3>Transfer Situation</h3>
            {(transferStatus > 0) ? (
                <>
                    <p>The player is listed for transfer for a price of {Moralis.Units.FromWei(transferStatus)} KICK</p>
                    <ContractButton
                        abi={playerTransferABI}
                        address={playerTransferAddress}
                        functionName="unlistPlayer"
                        params={{ _playerId: tokenId }}
                        text="Unlist the player"
                        callback={txSuccess}
                        disabled={false} />
                </>
            ) : (
                <>
                    <p>The player is not listed for transfer</p>
                    <Input
                        label="Asked Price (in KICK)"
                        name="transferPriceInput"
                        onBlur={handleTransferPriceInput}
                        onChange={handleTransferPriceInput}
                        value={transferPrice}
                    />
                    {((tokenApproval.toString() === playerTransferAddress.toString()) ? (
                        <ContractButton
                            abi={playerTransferABI}
                            address={playerTransferAddress}
                            functionName="listPlayerForTransfer"
                            params={{ _price: Moralis.Units.Token(transferPrice.toString(), "18"), _playerId: tokenId }}
                            text="List the player for transfer"
                            callback={txSuccess}
                            disabled={false}
                        />
                    ) : (
                        <ContractButton
                            abi={verifiableRandomFootballerABI}
                            address={verifiableRandomFootballerAddress}
                            functionName="approve"
                            params={{ to: playerTransferAddress, tokenId: tokenId }}
                            text="Approve the transfer contract"
                            callback={txSuccess}
                            disabled={false}
                        />
                    ))}
                </>
            )}
            <h3>Loan Situation</h3>
            {(loanListingStatus === "listed for loan") ? (
                <>
                    <p>The player is listed for loan for a price of {Moralis.Units.FromWei(loanPrice)} KICK and a duration of {loanDuration} blocks</p>
                    <ContractButton
                        abi={playerLoanABI}
                        address={playerLoanAddress}
                        functionName="unlistPlayer"
                        params={{ _playerId: tokenId }}
                        text="Unlist the player"
                        callback={txSuccess}
                        disabled={false}
                    />
                </>
            ) : (
                <>
                    <p>The player is not listed for loan</p>
                    <Input
                        label="Asked Price (in KICK)"
                        name="loanPriceInput"
                        onBlur={handleLoanPriceInput}
                        onChange={handleLoanPriceInput}
                        value={loanPrice}
                    />
                    <Input
                        label="Duration (number of blocks)"
                        name="loanDurationInput"
                        onBlur={handleLoanDurationInput}
                        onChange={handleLoanDurationInput}
                        value={loanDuration}
                    />
                    <ContractButton
                        abi={playerLoanABI}
                        address={playerLoanAddress}
                        functionName="listPlayerForLoan"
                        params={{ _duration: loanDuration, _price: Moralis.Units.Token(loanPrice.toString(), "18"), _playerId: tokenId }}
                        text="List the player for loan"
                        callback={txSuccess}
                        disabled={false}
                    />
                </>
            )}
            {(loanStatus === "on loan") ? (
                <p>The player is on loan to {loanBorrower} until block n° {loanTerm}</p>
            ) : (
                <p>The player is not on loan at the moment</p>
            )}
        </Wrapper>
    )
}

PlayerTransferLoan.propTypes = {
    tokenId: PropTypes.number,
}

export default PlayerTransferLoan