import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { useMoralis, useMoralisWeb3Api, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon } from "web3uikit"
import PlayerCard from "../PlayerCard"
import Grid from "../Grid"
import MintStepper from "../MintStepper"
import TransferList from "../TransferList"
import LoanList from "../LoanList"
import PlayerOnLoan from "../PlayerOnLoan"
import TeamsList from "../TeamsList"
import CheckGameStatus from "../CheckGameStatus"
import main from "../../images/main.jpg"
import { StyledLink, Wrapper, Content, Text, Image } from "./DefaultTabBar.styles"
import { contractAddresses, abi_VerifiableRandomFootballer, abi_LeagueGame } from "../../constants"


const DefaultTabBar = ({ defaultTab }) => {

    const { isWeb3Enabled } = useMoralis()
    const [mintPrice, setMintPrice] = useState("0")
    const [allNFTs, setAllNFTs] = useState({ result: [] })
    const [myNFTs, setMyNFTs] = useState({ result: [] })
    const [currentBlock, setCurrentBlock] = useState("")
    const [gameIds, setGameIds] = useState([])

    const verifiableRandomFootballerAddress = contractAddresses["VerifiableRandomFootballer"]
    const verifiableRandomFootballerABI = abi_VerifiableRandomFootballer
    const leagueGameAddress = contractAddresses["LeagueGame"]
    const leagueGameABI = abi_LeagueGame

    const web3Api = useMoralisWeb3Api({})

    const { runContractFunction: getMintPrice } = useWeb3Contract({
        abi: verifiableRandomFootballerABI,
        contractAddress: verifiableRandomFootballerAddress,
        functionName: "price",
        params: {},
    })

    const { runContractFunction: getGameIds } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "gameIds",
        params: {},
    })

    const updateUIValues = async () => {
        const mintPriceFromCall = (await getMintPrice()).toString()
        setMintPrice(mintPriceFromCall)
        const gameIdsFromCall = await getGameIds()
        let gameIdsFromLoop = []
        for (let index = 1; index < gameIdsFromCall; index++) {
            gameIdsFromLoop.push(index)
        }
        setGameIds(gameIdsFromLoop)

        let NFTsFromCall = await web3Api.token.getAllTokenIds({
            chain: "mumbai",
            address: verifiableRandomFootballerAddress,
        })
        setAllNFTs(NFTsFromCall)
        NFTsFromCall = await web3Api.account.getNFTsForContract({
            chain: "mumbai",
            token_address: verifiableRandomFootballerAddress,
        })
        setMyNFTs(NFTsFromCall)
        const currentBlockFromCall = await web3Api.native.getDateToBlock({
            chain: "mumbai",
            date: Date(),
        })
        setCurrentBlock(currentBlockFromCall.block.toString())
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
                <Wrapper>
                    <Text>
                        <h1>About this game</h1>
                        <p>The Farmers League is a fantasy football game, 100% on-chain.</p>
                        <p>It is based on an NFT collection of 10,000 players called the VRF for Verified Random Footballers.</p>
                        <p>The generation of the NFT is a fully on-chain process thanks to the use of Chainlink VRF (Verifiable Randomness Function). Each player has 100% on-chain SVG art + attributes.</p>
                        <p>The game mechanic itself is straight forward but has strong social and financial implications. To succeed in this game, players need good coordination, strategical consistency, and a bit of diligence.</p>
                        <p>Participants organize their players in teams. Then they challenge other teams. They put tokens at stake for the games (the dedicated ERC20 “KICK” token).</p>
                        <p>The game result depends for half on the players NFT attributes, half on the team building and the players commitment.</p>
                    </Text>
                    <Image src={main} />
                </Wrapper>
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
                        <PlayerCard key={id.token_id} tokenId={parseInt(id.token_id)} />
                    ))}
                </Grid>
            </Tab>
            <Tab
                tabKey={4}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="user" />{' '}<span style={{ paddingLeft: '4px' }}>My players{' '}</span></div>}
            >
                <Content>
                    <Grid header="My players">
                        {myNFTs.result.map(id => (
                            <PlayerCard key={id.token_id} tokenId={parseInt(id.token_id)} clickable />
                        ))}
                    </Grid>
                </Content>
                <Content>
                    <Grid header="Players loaned">
                        {allNFTs.result.map(id => (
                            <PlayerOnLoan key={id.token_id} tokenId={parseInt(id.token_id)} currentBlock={parseInt(currentBlock)} />
                        ))}
                    </Grid>
                </Content>
            </Tab>
            <StyledLink to="/teams/0/0">
                <Tab
                    tabKey={5}
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="link" />{' '}<span style={{ paddingLeft: '4px' }}>Teams{' '}</span></div>}
                />
            </StyledLink>
            <Tab
                tabKey={6}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="list" />{' '}<span style={{ paddingLeft: '4px' }}>Tranfers & Loans{' '}</span></div>}
            >
                <Content>
                    <TransferList />
                </Content>
                <Content>
                    <LoanList />
                </Content>
            </Tab>
            <Tab
                tabKey={7}
                tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="calendar" />{' '}<span style={{ paddingLeft: '4px' }}>Competition{' '}</span></div>}
            >
                <Content>
                    <TeamsList currentBlock={parseInt(currentBlock)} gridHeader="Teams Ready" />
                </Content>
                <Content>
                    <TeamsList currentBlock={parseInt(currentBlock)} gridHeader="Up-coming Games" />
                </Content>
                <Content>
                    <TeamsList currentBlock={parseInt(currentBlock)} gridHeader="On-going Games" />
                </Content>
                <Content>
                    <TeamsList currentBlock={parseInt(currentBlock)} gridHeader="Games To Finish" />
                </Content>
                <Content>
                    <Grid header="Past Games">
                        {gameIds.map(id => (
                            <CheckGameStatus gameId={id} currentBlock={parseInt(currentBlock)} />
                        ))}
                    </Grid>
                </Content>
            </Tab>
        </TabList>
    )
}

DefaultTabBar.propTypes = {
    defaultTab: PropTypes.string
}

export default DefaultTabBar


