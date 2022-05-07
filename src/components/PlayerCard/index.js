import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import CryptoJS from "crypto-js"
import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi_VerifiableRandomFootballer } from "../../constants"
import { Wrapper, Image } from "./PlayerCard.styles"

const PlayerCard = ({ tokenId }) => {

    const [name, setName] = useState("")
    const [preferredPosition, setPreferredPosition] = useState("")
    const [compatiblePositions, setCompatiblePositions] = useState("")
    const [attack, setAttack] = useState(0)
    const [defense, setDefense] = useState(0)
    const [imageURI, setImageURI] = useState("")

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const ABI = abi_VerifiableRandomFootballer

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: ABI,
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

    useEffect(() => {
        updateTokenURI()
    })

    return (
        <Wrapper>
            <h3>{name}</h3>
            <p>Preferred position: {preferredPosition} </p>
            <p>Compatible positions: {compatiblePositions} </p>
            <p>Defense: {defense} / Attack: {attack}</p>
            <Image src={imageURI} />
        </Wrapper>
    )
}

PlayerCard.propTypes = {
    tokenId: PropTypes.string
}

export default PlayerCard