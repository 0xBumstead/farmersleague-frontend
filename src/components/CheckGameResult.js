import React, { useEffect, useState } from "react"
import { useMoralis, useMoralisWeb3Api } from "react-moralis"
import PropTypes from "prop-types"
import { contractAddresses, eventTopics, abi_event_gameFinished } from "../constants"

const CheckGameResult = ({ gameId, homeTeam, awayTeam }) => {

    const { isWeb3Enabled } = useMoralis()
    const Web3Api = useMoralisWeb3Api({})

    const [gameResult, setGameResult] = useState("")

    const leagueGameAddress = contractAddresses["LeagueGame"]
    const resultTopic = eventTopics["gameFinished"]
    const gameFinishedABI = abi_event_gameFinished

    const updateUIValues = async () => {

        const events = await Web3Api.native.getContractEvents({
            chain: "mumbai",
            abi: gameFinishedABI,
            address: leagueGameAddress,
            topic: resultTopic,
        })

        const results = events.result

        for (let index = 0; index < results.length; index++) {
            if (results[index].data["gameId"] === gameId.toString()) {
                setGameResult(results[index].data["result"])
                break
            }
        }

    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <>
            {(gameResult === 1) ? (
                <p>Team #{homeTeam} has won against Team #{awayTeam} in Game #{gameId}</p>
            ) : (
                (gameResult === 2) ? (
                    <p>Team #{homeTeam} has lost against Team #{awayTeam} in Game #{gameId}</p>
                ) : (
                    <p>Team #{homeTeam} and Team #{awayTeam} did a draw in Game #{gameId}</p>
                )
            )}
        </>
    )
}

CheckGameResult.propTypes = {
    gameId: PropTypes.number,
    homeTeam: PropTypes.number,
    awayTeam: PropTypes.number,
}

export default CheckGameResult