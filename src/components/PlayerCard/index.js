import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import CryptoJS from "crypto-js"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import ContractButton from "../ContractButton"
import { Wrapper, Image, StyledLink } from "./PlayerCard.styles"
import { contractAddresses, abi_VerifiableRandomFootballer, abi_LeagueTeam } from "../../constants"

const PlayerCard = ({ tokenId, clickable, teamId, isPlayerTeam, captainId }) => {

    const dispatch = useNotification()
    const { isWeb3Enabled } = useMoralis()

    const [team, setTeam] = useState(teamId)
    const [name, setName] = useState("")
    const [preferredPosition, setPreferredPosition] = useState("")
    const [compatiblePositions, setCompatiblePositions] = useState("")
    const [attack, setAttack] = useState(0)
    const [defense, setDefense] = useState(0)
    const [imageURI, setImageURI] = useState("")

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const verifiableRandomFootballerABI = abi_VerifiableRandomFootballer
    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const leagueTeamABI = abi_LeagueTeam

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: verifiableRandomFootballerABI,
        contractAddress: verifiableRandomFootballerAddress,
        functionName: "tokenURI",
        params: { tokenId },
    })

    const updateTokenURI = async () => {
        const tokenURI = await getTokenURI()
        const tokenURIbase64 = CryptoJS.enc.Base64.parse(tokenURI.replace("data:application/json;base64,", ""))
        const tokenURIutf8 = CryptoJS.enc.Utf8.stringify(tokenURIbase64)
        const tokenURIjson = JSON.parse(tokenURIutf8)
        setName(tokenURIjson.name)
        setPreferredPosition(tokenURIjson.attributes[0].value)
        setCompatiblePositions(tokenURIjson.attributes[1].value)
        setDefense(tokenURIjson.attributes[2].value)
        setAttack(tokenURIjson.attributes[3].value)
        setImageURI(tokenURIjson.image)
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

    useEffect(() => {
        if (isWeb3Enabled) {
            updateTokenURI()
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
                    {(team > 0 && (tokenId - captainId) !== 0) ? (
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
        </Wrapper>
    )
}

PlayerCard.propTypes = {
    tokenId: PropTypes.number,
    clickable: PropTypes.bool,
    teamId: PropTypes.number,
    isPlayerTeam: PropTypes.bool,
    captainId: PropTypes.number,
}

export default PlayerCard