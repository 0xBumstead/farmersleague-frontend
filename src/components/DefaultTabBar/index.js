import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { useMoralis, useMoralisWeb3Api, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon, Illustration } from "web3uikit"
import PlayerCard from "../PlayerCard"
import Grid from "../Grid"
import MintStepper from "../MintStepper"
import { StyledLink } from "./DefaultTabBar.styles"
import { contractAddresses, abi_VerifiableRandomFootballer } from "../../constants"


const DefaultTabBar = ({ defaultTab }) => {

    const { isWeb3Enabled } = useMoralis()
    const [mintPrice, setMintPrice] = useState("0")
    const [allNFTs, setAllNFTs] = useState({ result: [] })
    const [myNFTs, setMyNFTs] = useState({ result: [] })

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const ABI = abi_VerifiableRandomFootballer

    const Web3Api = useMoralisWeb3Api({})

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
        <TabList
            defaultActiveKey={defaultTab}
            tabStyle="bar"
        >
            <Tab
                tabKey={1}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="pin" /><span style={{ paddingLeft: '4px' }}>Home{' '}</span></div>}
            >
                <Illustration logo="comingSoon" />
            </Tab>
            <Tab
                tabKey={2}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="plus" /><span style={{ paddingLeft: '4px' }}>Mint{' '}</span></div>}
            >

                <MintStepper price={mintPrice} />
            </Tab>
            <Tab
                tabKey={3}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="grid" />{' '}<span style={{ paddingLeft: '4px' }}>Collection{' '}</span></div>}
            >
                <Grid header="Full collection">
                    {allNFTs.result.map(id => (
                        <PlayerCard tokenId={id.token_id} />
                    ))}
                </Grid>
            </Tab>
            <Tab
                tabKey={4}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="user" />{' '}<span style={{ paddingLeft: '4px' }}>My players{' '}</span></div>}
            >
                <Grid header="My players">
                    {myNFTs.result.map(id => (
                        <PlayerCard key={id.token_id} tokenId={id.token_id} clickable />
                    ))}
                </Grid>
            </Tab>
            <StyledLink to="/teams/0">
                <Tab
                    tabKey={5}
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="link" />{' '}<span style={{ paddingLeft: '4px' }}>Teams{' '}</span></div>}
                />
            </StyledLink>
            <Tab
                tabKey={6}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="list" />{' '}<span style={{ paddingLeft: '4px' }}>Tranfers & Loans{' '}</span></div>}
            >
                <Illustration logo="comingSoon" />
            </Tab>
            <Tab
                tabKey={7}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="calendar" />{' '}<span style={{ paddingLeft: '4px' }}>Competition{' '}</span></div>}
            >
                <Illustration logo="comingSoon" />
            </Tab>
        </TabList>
    )
}

DefaultTabBar.propTypes = {
    defaultTab: PropTypes.number
}

export default DefaultTabBar

