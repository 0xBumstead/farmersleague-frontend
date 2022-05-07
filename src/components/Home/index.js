import React, { useEffect, useState } from "react"
import { useMoralis, useMoralisWeb3Api, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon, Illustration } from "web3uikit"
import PlayerCard from "../PlayerCard"
import Grid from "../Grid"
import MintStepper from "../MintStepper"
import { contractAddresses, abi_VerifiableRandomFootballer } from "../../constants"
import { Wrapper } from "./Home.styles"


const Home = () => {

    const { isWeb3Enabled } = useMoralis()
    const [mintPrice, setMintPrice] = useState("0")
    const [allNFTs, setAllNFTs] = useState({ result: [] })
    const [myNFTs, setMyNFTs] = useState({ result: [] })

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const ABI = abi_VerifiableRandomFootballer

    const Web3Api = useMoralisWeb3Api({
    })

    const { runContractFunction: getMintPrice } = useWeb3Contract({
        abi: ABI,
        contractAddress: verifiableRandomFootballerAddress,
        functionName: "price",
        params: {},
    })

    const updateUIValues = async () => {
        const mintPriceFromCall = (await getMintPrice()).toString()
        setMintPrice(mintPriceFromCall)
        let NFTsFromCall = await Web3Api.token.getAllTokenIds({
            chain: "mumbai",
            address: verifiableRandomFootballerAddress,
        })
        setAllNFTs(NFTsFromCall)
        NFTsFromCall = await Web3Api.account.getNFTsForContract({
            chain: "mumbai",
            token_address: verifiableRandomFootballerAddress,
        })
        setMyNFTs(NFTsFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <>
            <Wrapper>
                <TabList
                    defaultActiveKey={1}
                    tabStyle="bar"
                >
                    <Tab
                        tabKey={1}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="plus" /><span style={{ paddingLeft: '4px' }}>Mint{' '}</span></div>}
                    >

                        <MintStepper price={mintPrice} />
                    </Tab>
                    <Tab
                        tabKey={2}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="grid" />{' '}<span style={{ paddingLeft: '4px' }}>Collection{' '}</span></div>}
                    >
                        <Grid header="Full collection">
                            {allNFTs.result.map(id => (
                                <PlayerCard tokenId={id.token_id} />
                            ))}
                        </Grid>
                    </Tab>
                    <Tab
                        tabKey={3}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="user" />{' '}<span style={{ paddingLeft: '4px' }}>Dashboard{' '}</span></div>}
                    >
                        <Grid header="My players">
                            {myNFTs.result.map(id => (
                                <PlayerCard key={id.token_id} tokenId={id.token_id} />
                            ))}
                        </Grid>
                    </Tab>
                    <Tab
                        tabKey={4}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="calendar" />{' '}<span style={{ paddingLeft: '4px' }}>Competition{' '}</span></div>}
                    >
                        <p>
                            <Illustration logo="comingSoon" />
                        </p>
                    </Tab>
                </TabList>
            </Wrapper>
        </>
    )
}

export default Home


