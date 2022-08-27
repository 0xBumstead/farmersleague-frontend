import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import CryptoJS from "crypto-js"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper, Image, StyledLink } from "./PlayerCard.styles"
import { contractAddresses, abi_VerifiableRandomFootballer, abi_LeagueTeam, abi_PlayerTransfer, abi_PlayerLoan, abi_KickToken, abi_PlayerRate } from "../../constants"

const PlayerCard = ({ tokenId, clickable, teamId, isPlayerTeam, captainId, transferable, loanable, gameId, position }) => {

    const dispatch = useNotification()
    const { Moralis, user, isWeb3Enabled } = useMoralis()

    const [team, setTeam] = useState(teamId)
    const [name, setName] = useState("")
    const [preferredPosition, setPreferredPosition] = useState("")
    const [compatiblePositions, setCompatiblePositions] = useState("")
    const [attack, setAttack] = useState(0)
    const [defense, setDefense] = useState(0)
    const [imageURI, setImageURI] = useState("")
    const [transferPrice, setTransferPrice] = useState(0)
    const [loanPrice, setLoanPrice] = useState(0)
    const [loanDuration, setLoanDuration] = useState(0)
    const [kickAllowanceTransfer, setKickAllowanceTransfer] = useState(0)
    const [kickAllowanceLoan, setKickAllowanceLoan] = useState(0)

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const verifiableRandomFootballerABI = abi_VerifiableRandomFootballer
    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const leagueTeamABI = abi_LeagueTeam
    const playerTransferAddress = contractAddresses["PlayerTransfer"]
    const playerTransferABI = abi_PlayerTransfer
    const playerLoanAddress = contractAddresses["PlayerLoan"]
    const playerLoanABI = abi_PlayerLoan
    const kickTokenAddress = contractAddresses["KickToken"]
    const kickTokenABI = abi_KickToken
    const playerRateAddress = contractAddresses["PlayerRate"]
    const playerRateABI = abi_PlayerRate
    const walletAddress = user.get("ethAddress")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: verifiableRandomFootballerABI,
        contractAddress: verifiableRandomFootballerAddress,
        functionName: "tokenURI",
        params: { tokenId },
    })

    const { runContractFunction: getTransferPrice } = useWeb3Contract({
        abi: playerTransferABI,
        contractAddress: playerTransferAddress,
        functionName: "playersForTransfer",
        params: { _playerId: tokenId }
    })

    const { runContractFunction: getLoanInfo } = useWeb3Contract({
        abi: playerLoanABI,
        contractAddress: playerLoanAddress,
        functionName: "playersForLoan",
        params: { _playerId: tokenId }
    })

    const { runContractFunction: getKickAllowanceTransfer } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "allowance",
        params: { owner: walletAddress, spender: playerTransferAddress },
    })

    const { runContractFunction: getKickAllowanceLoan } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "allowance",
        params: { owner: walletAddress, spender: playerLoanAddress },
    })

    const { runContractFunction: transferPlayer } = useWeb3Contract({
        abi: playerTransferABI,
        contractAddress: playerTransferAddress,
        functionName: "transfer",
        params: { _playerId: tokenId }
    })

    const { runContractFunction: loanPlayer } = useWeb3Contract({
        abi: playerLoanABI,
        contractAddress: playerLoanAddress,
        functionName: "loan",
        params: { _playerId: tokenId }
    })

    const updateUIValues = async () => {
        const tokenURI = await getTokenURI()
        const tokenURIbase64 = CryptoJS.enc.Base64.parse(tokenURI.replace("data:application/json;base64,", ""))
        const tokenURIutf8 = CryptoJS.enc.Utf8.stringify(tokenURIbase64)
        const tokenURIjson = JSON.parse(tokenURIutf8)
        const transferPriceFromCall = await getTransferPrice()
        const loanInfoFromCall = await getLoanInfo()
        const kickAllowanceTransferFromCall = Moralis.Units.FromWei(await getKickAllowanceTransfer())
        const kickAllowanceLoanFromCall = Moralis.Units.FromWei(await getKickAllowanceLoan())
        setName(tokenURIjson.name)
        setPreferredPosition(tokenURIjson.attributes[0].value)
        setCompatiblePositions(tokenURIjson.attributes[1].value)
        setDefense(tokenURIjson.attributes[2].value)
        setAttack(tokenURIjson.attributes[3].value)
        setImageURI(tokenURIjson.image)
        setTransferPrice(transferPriceFromCall.toString())
        setLoanDuration(loanInfoFromCall.duration.toString())
        setLoanPrice(loanInfoFromCall.price.toString())
        setKickAllowanceTransfer(kickAllowanceTransferFromCall)
        setKickAllowanceLoan(kickAllowanceLoanFromCall)
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
        setTeam(0)
    }

    const approveTransferSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        const transferTx = await transferPlayer()
        await transferTx.wait(1)
        updateUIValues()
    }

    const approveLoanSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        const loanTx = await loanPlayer()
        await loanTx.wait(1)
        updateUIValues()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            {clickable ? (
                <StyledLink to={`/player/${tokenId}`}>
                    <h3>{name}</h3>
                    <p>Preferred position: {preferredPosition} </p>
                    <p>Compatible positions: {compatiblePositions} </p>
                    <p>Defense: {defense} / Attack: {attack}</p>
                    <Image src={imageURI} />
                    <></>
                </StyledLink>
            ) : (
                <>
                    <h3>{name}</h3>
                    <p>Preferred position: {preferredPosition} </p>
                    <p>Compatible positions: {compatiblePositions} </p>
                    <p>Defense: {defense} / Attack: {attack}</p>
                    <Image src={imageURI} />
                    {(team > 0 && (tokenId - captainId) !== 0 && gameId === undefined) ? (
                        <>
                            {isPlayerTeam ? (
                                <ContractButton
                                    abi={leagueTeamABI}
                                    address={leagueTeamAddress}
                                    functionName="releasePlayer"
                                    params={{ _playerId: tokenId, _teamId: teamId }}
                                    text="Release the player"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            ) : (
                                <ContractButton
                                    abi={leagueTeamABI}
                                    address={leagueTeamAddress}
                                    functionName="validateApplication"
                                    params={{ _playerId: tokenId, _teamId: teamId }}
                                    text="Validate this application"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </>
            )}
            {transferable ? (
                <>
                    <p>Transfer price: {Moralis.Units.FromWei(transferPrice)} KICK</p>
                    {(kickAllowanceTransfer < transferPrice) ? (
                        <ContractButton
                            abi={kickTokenABI}
                            address={kickTokenAddress}
                            functionName="approve"
                            params={{ spender: playerTransferAddress, amount: Moralis.Units.ETH(100000000) }}
                            text="Buy this player"
                            callback={approveTransferSuccess}
                            disabled={false}
                        />
                    ) : (
                        <ContractButton
                            abi={playerTransferABI}
                            address={playerTransferAddress}
                            functionName="transfer"
                            params={{ _playerId: tokenId }}
                            text="Buy this player"
                            callback={txSuccess}
                            disabled={false}
                        />
                    )}
                </>
            ) : (
                <></>
            )}
            {loanable ? (
                <>
                    <p>Loan price: {Moralis.Units.FromWei(loanPrice)} KICK for {loanDuration} blocks</p>
                    {(kickAllowanceLoan < loanPrice) ? (
                        <ContractButton
                            abi={kickTokenABI}
                            address={kickTokenAddress}
                            functionName="approve"
                            params={{ spender: playerLoanAddress, amount: Moralis.Units.ETH(100000000) }}
                            text="Loan this player"
                            callback={approveLoanSuccess}
                            disabled={false}
                        />
                    ) : (
                        <ContractButton
                            abi={playerLoanABI}
                            address={playerLoanAddress}
                            functionName="loan"
                            params={{ _playerId: tokenId }}
                            text="Loan this player"
                            callback={txSuccess}
                            disabled={false}
                        />
                    )}
                </>
            ) : (
                <></>
            )}
            {(gameId > 0) ? (
                <ContractButton
                    abi={playerRateABI}
                    address={playerRateAddress}
                    functionName="signUpPlayer"
                    params={{ _playerId: tokenId, _teamId: teamId, _gameId: gameId, _position: position }}
                    text="Sign with this Player"
                    callback={txSuccess}
                    disabled={false}
                />
            ) : (
                <></>
            )}
        </Wrapper>
    )
}

PlayerCard.propTypes = {
    tokenId: PropTypes.number,
    clickable: PropTypes.bool,
    teamId: PropTypes.number,
    isPlayerTeam: PropTypes.bool,
    captainId: PropTypes.number,
    transferable: PropTypes.bool,
    loanable: PropTypes.bool,
    gameId: PropTypes.number,
    position: PropTypes.number,
}

export default PlayerCard