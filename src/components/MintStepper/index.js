import React, { useState } from "react"
import PropTypes from "prop-types"
import { ethers } from "ethers"
import { useMoralis } from "react-moralis"
import { Stepper, Button, useNotification } from "web3uikit"
import { contractAddresses, abi_VerifiableRandomFootballer } from "../../constants"
import ContractButton from "../ContractButton"
import PlayerCard from "../PlayerCard"
import { Wrapper, Text, Nav } from "./MintStepper.styles"

const MintStepper = ({ price }) => {

    const { Moralis } = useMoralis()
    const dispatch = useNotification()
    const [tokenId, setTokenId] = useState("0")
    const [isGenerated, setIsGenerated] = useState(false)

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const ABI = abi_VerifiableRandomFootballer

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const requestSuccess = async (tx) => {
        const result = await tx.wait(1)
        const abiCoder = ethers.utils.defaultAbiCoder
        const data = abiCoder.decode(["bytes32", "uint16"], result.logs[4].data)
        setTokenId(data[1].toString())
        handleNewNotification(tx)
    }

    const generationSuccess = async (tx) => {
        await tx.wait(1)
        setIsGenerated(true)
        handleNewNotification(tx)
    }

    const reset = () => {
        setTokenId("0")
        setIsGenerated(false)
        const event = new Event("prev")
        document.dispatchEvent(event)
        document.dispatchEvent(event)
        document.dispatchEvent(event)
        document.dispatchEvent(event)
    }

    return (
        <Wrapper>
            <Stepper
                onComplete={function noRefCheck() { }}
                step={1}
                hasNavButtons={false}
                stepData={[
                    {
                        content:
                            <>
                                <Text>
                                    <h1>Get a new player with the mint function</h1>
                                    <p>This process needs you to validate two transactions in your wallet.</p>
                                    <p>The first one is requestPlayer and will get an empty NFT with just a unique token ID.
                                        This will cost {Moralis.Units.FromWei(price)} Matic + gas fees (quite low).</p>
                                    <p>When this transaction is validated, the Chainlink VRF will return a random number associated to your token ID.</p>
                                    <p>You will then need to validate the second transaction: generatePlayer that will create the player attributes and art based on the random number.
                                        For the second transaction you will pay only the gas fees, but they will be quite high (up to 4M gas).</p>
                                    <p>And finally you'll discover your new player!</p>
                                </Text>
                                <Nav>
                                    <Button id="next" text="Start" theme="secondary" type="button" />
                                </Nav>
                            </>,
                    },
                    {
                        content:
                            <Nav>
                                <Button id="prev" text="Prev" theme="secondary" type="button" />
                                <ContractButton
                                    abi={ABI}
                                    address={verifiableRandomFootballerAddress}
                                    functionName="requestPlayer"
                                    msgValue={price}
                                    params={{}}
                                    text="Mint a new player"
                                    callback={requestSuccess}
                                    disabled={tokenId !== "0"}
                                />
                                <Button id="next" text="Next" theme="secondary" type="button" disabled={tokenId === "0"} />
                            </Nav>
                    },
                    {
                        content:
                            <>
                                <Text>
                                    {isGenerated ? (
                                        <p>Your player is ready ! Go to next step to reveal it</p>
                                    ) : (
                                        <>
                                            <h3>Congratulations !</h3>
                                            <p>You are now the owner of Player #{tokenId}</p>
                                            <p>Please wait at least one minute before generating the metadata while the Chainlink VRF is providing the randomness</p>
                                        </>
                                    )}
                                </Text>
                                <Nav>
                                    <Button id="prev" text="Prev" theme="secondary" type="button" disabled={true} />
                                    <ContractButton
                                        abi={ABI}
                                        address={verifiableRandomFootballerAddress}
                                        functionName="generatePlayer"
                                        msgValue="0"
                                        params={{ _tokenId: tokenId }}
                                        text="Generate the metadata"
                                        callback={generationSuccess}
                                        disabled={isGenerated}
                                    />
                                    <Button id="next" text="Next" theme="secondary" type="button" disabled={!isGenerated} />
                                </Nav>
                            </>
                    },
                    {
                        content:
                            <>
                                <Text>
                                    <h3>Your new player :</h3>
                                </Text>
                                <Nav>
                                    <Button id="prev" text="Prev" theme="secondary" type="button" disabled={true} />
                                    <PlayerCard tokenId={tokenId} />
                                    <Button id="next" text="Next" theme="secondary" type="button" />
                                </Nav>
                            </>
                    },
                    {
                        content:
                            <>
                                <Text>
                                    <p>You can now start over the mint</p>
                                </Text>
                                <Nav>
                                    <Button text="Mint another one ! " theme="primary" type="button" onClick={() => reset()} />
                                </Nav>
                            </>
                    }
                ]}
            />
        </Wrapper >
    )
}

MintStepper.propTypes = {
    price: PropTypes.string
}

export default MintStepper