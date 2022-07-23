import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Grid from "../Grid"
import PlayerCard from "../PlayerCard"
import { Wrapper } from "./LoanList.styles"
import { contractAddresses, abi_PlayerLoan } from "../../constants"

const LoanList = () => {

    const { isWeb3Enabled } = useMoralis()

    const [players, setPlayers] = useState([])

    const playerLoanAddress = contractAddresses["PlayerLoan"]
    const playerLoanABI = abi_PlayerLoan

    const { runContractFunction: loanListArray } = useWeb3Contract({
        abi: playerLoanABI,
        contractAddress: playerLoanAddress,
        functionName: "getLoanListArray"
    })

    const updateUIValues = async () => {
        const playersFromCall = await loanListArray()
        let playersFiltered = []
        for (let index = 0; index < playersFromCall.length; index++) {
            if (playersFromCall[index] !== 0) {
                playersFiltered.push(playersFromCall[index])
            }
        }
        setPlayers(playersFiltered)
    }


    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <Grid header="Player listed for loan">
                {players.map(id => (
                    <PlayerCard key={id} tokenId={parseInt(id)} loanable />
                ))}
            </Grid>
        </Wrapper>

    )
}

export default LoanList