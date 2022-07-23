import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Grid from "../Grid"
import PlayerCard from "../PlayerCard"
import { Wrapper } from "./TransferList.styles"
import { contractAddresses, abi_PlayerTransfer } from "../../constants"

const TransferList = () => {

    const { isWeb3Enabled } = useMoralis()

    const [players, setPlayers] = useState([])

    const playerTransferAddress = contractAddresses["PlayerTransfer"]
    const playerTransferABI = abi_PlayerTransfer

    const { runContractFunction: transferListArray } = useWeb3Contract({
        abi: playerTransferABI,
        contractAddress: playerTransferAddress,
        functionName: "getTransferListArray"
    })

    const updateUIValues = async () => {
        const playersFromCall = await transferListArray()
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
            <Grid header="Player listed for transfer">
                {players.map(id => (
                    <PlayerCard key={id} tokenId={parseInt(id)} transferable />
                ))}
            </Grid>
        </Wrapper>

    )
}

export default TransferList