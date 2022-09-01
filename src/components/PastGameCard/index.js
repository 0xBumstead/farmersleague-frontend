import React, { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import CheckGameResult from "../CheckGameResult"
import { Wrapper } from "./PastGameCard.styles"
import { contractAddresses, abi_LeagueGame } from "../../constants"

const PastGameCard = ({ gameId, homeTeam, awayTeam }) => {

    const { isWeb3Enabled } = useMoralis()

    const [homeTeamGameId, setHomeTeamGameId] = useState(0)
    const [awayTeamGameId, setAwayTeamGameId] = useState(0)

    const leagueGameABI = abi_LeagueGame
    const leagueGameAddress = contractAddresses["LeagueGame"]

    const { runContractFunction: getHomeTeamGameId } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: homeTeam, _rank: 1 }
    })

    const { runContractFunction: getAwayTeamGameId } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: awayTeam, _rank: 1 }
    })

    const updateUIValues = async () => {
        const homeTeamGameIdFromCall = await getHomeTeamGameId()
        const awayTeamGameIdFromCall = await getAwayTeamGameId()
        setHomeTeamGameId(parseInt(homeTeamGameIdFromCall))
        setAwayTeamGameId(parseInt(awayTeamGameIdFromCall))
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    if (homeTeamGameId !== gameId && awayTeamGameId !== gameId) {
        return (
            <Wrapper>
                <CheckGameResult gameId={gameId} homeTeam={homeTeam} awayTeam={awayTeam} />
            </Wrapper>
        )
    }
}

PastGameCard.propTypes = {
    gameId: PropTypes.number,
    homeTeam: PropTypes.number,
    awayTeam: PropTypes.number,
}

export default PastGameCard