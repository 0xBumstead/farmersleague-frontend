import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import { useMoralis, useMoralisWeb3Api, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper, Content, ButtonWrapper } from "./DeclineChallenge.Styles"
import { contractAddresses, abi_KickToken, abi_LeagueGame } from "../../constants"

const DeclineChallenge = ({ challengedTeam, challengingTeam, captainId }) => {

    const dispatch = useNotification()
    const navigate = useNavigate()
    const { Moralis, user, isWeb3Enabled } = useMoralis()
    const Web3Api = useMoralisWeb3Api({})

    const [deadLine, setDeadLine] = useState(0)
    const [declinePrice, setDeclinePrice] = useState(0)
    const [kickBalance, setKickBalance] = useState(0)
    const [kickAllowance, setKickAllowance] = useState(0)
    const [currentBlock, setCurrentBlock] = useState(0)
    const [limitDate, setLimitDate] = useState("")

    const leagueGameAddress = contractAddresses["LeagueGame"]
    const kickTokenAddress = contractAddresses["KickToken"]
    const kickTokenABI = abi_KickToken
    const leagueGameABI = abi_LeagueGame
    const walletAddress = user.get("ethAddress")

    const { runContractFunction: getDeadLine } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamChallenge",
        params: { _challengedTeamId: challengedTeam, _challengingTeamId: challengingTeam },
    })

    const { runContractFunction: getDeclinePrice } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "prices",
        params: { _rank: 1 }
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
        params: { owner: walletAddress, spender: leagueGameAddress },
    })

    const { runContractFunction: declineChallenge } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "declineChallenge",
        params: { _teamId: challengedTeam, _opponentTeamId: challengingTeam },
    })

    const updateUIValues = async () => {
        const deadLineFromCall = parseInt(await getDeadLine())
        const declinePriceFromCall = Moralis.Units.FromWei(await getDeclinePrice())
        const kickBalanceFromCall = Moralis.Units.FromWei(await getKickBalance())
        const kickAllowanceFromCall = Moralis.Units.FromWei(await getKickAllowance())
        const currentBlockFromCall = await Web3Api.native.getDateToBlock({
            chain: "mumbai",
            date: Date(),
        })
        setDeadLine(deadLineFromCall)
        setDeclinePrice(declinePriceFromCall)
        setKickBalance(kickBalanceFromCall)
        setKickAllowance(kickAllowanceFromCall)
        setCurrentBlock(currentBlockFromCall["block"])
        let limitDateCalculated = new Date()

        limitDateCalculated.setTime(limitDateCalculated.getTime() + (1000 * (deadLineFromCall - currentBlockFromCall["block"]) / 5))
        if (deadLineFromCall > currentBlockFromCall["block"]) {
            setLimitDate(limitDateCalculated.toString())
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
        navigate(`/player/${captainId}`)
    }

    const approveSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        const declineTx = await declineChallenge()
        await declineTx.wait(1)
        navigate(`/player/${captainId}`)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <Content>
                <h1>Pending challenge</h1>
                <p>The team #{challengedTeam} has been challenged by the team #{challengingTeam}</p>
                {(deadLine > currentBlock) ? (
                    <>
                        <p>The challenge expires on block n°{deadLine} / Current block is {currentBlock}</p>
                        <p>The challenge is expected to expire around {limitDate}</p>
                        <ButtonWrapper>
                            {(kickAllowance < declinePrice) ? (
                                <ContractButton
                                    abi={kickTokenABI}
                                    address={kickTokenAddress}
                                    functionName="approve"
                                    params={{ spender: leagueGameAddress, amount: Moralis.Units.ETH(100000000) }}
                                    text="Decline the challenge"
                                    callback={approveSuccess}
                                    disabled={false}
                                />
                            ) : (
                                <ContractButton
                                    abi={leagueGameABI}
                                    address={leagueGameAddress}
                                    functionName="declineChallenge"
                                    params={{ _teamId: challengedTeam, _opponentTeamId: challengingTeam }}
                                    text="Decline the challenge"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            )}
                        </ButtonWrapper>
                        <p>Declining a challenge cost {declinePrice} KICK / You have : {kickBalance}</p>
                    </>
                ) : (
                    <p>The challenge has expired on block n°{deadLine} / Current block is {currentBlock}</p>
                )}
            </Content>
        </Wrapper>
    )
}

DeclineChallenge.propTypes = {
    challengedTeam: PropTypes.number,
    challengingTeam: PropTypes.number,
    captainId: PropTypes.number
}

export default DeclineChallenge