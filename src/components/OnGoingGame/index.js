import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon } from "web3uikit"
import SignUpPlayer from "../SignUpPlayer"
import { Wrapper, Content, StyledLink } from "./OnGoingGame.styles"
import { contractAddresses, abi_LeagueGame, abi_PlayerRate } from "../../constants"

const OnGoingGame = () => {

    const { objectId: gameId, firstParamId: homeTeam, secondParamId: awayTeam } = useParams()
    const { isWeb3Enabled } = useMoralis()

    const [homeTeamLayout, setHomeTeamLayout] = useState(0)
    const [awayTeamLayout, setAwayTeamLayout] = useState(0)
    const [homeTeamPlayers, setHomeTeamPlayers] = useState([])
    const [awayTeamPlayers, setAwayTeamPlayers] = useState([])

    const leagueGameAddress = contractAddresses["LeagueGame"]
    const leagueGameABI = abi_LeagueGame
    const playerRateAddress = contractAddresses["PlayerRate"]
    const playerRateABI = abi_PlayerRate

    const { runContractFunction: getHomeTeamLayout } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: homeTeam, _rank: 2 }
    })

    const { runContractFunction: getAwayTeamLayout } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: awayTeam, _rank: 2 }
    })

    const { runContractFunction: getPlayers } = useWeb3Contract({
        abi: playerRateABI,
        contractAddress: playerRateAddress,
        functionName: "getGamePlayers",
        params: { _gameId: gameId }
    })

    const updateUIValues = async () => {
        const homeTeamLayoutFromCall = await getHomeTeamLayout()
        const awayTeamLayoutFromCall = await getAwayTeamLayout()
        const playersFromCall = await getPlayers()
        setHomeTeamLayout(homeTeamLayoutFromCall)
        setAwayTeamLayout(awayTeamLayoutFromCall)
        setHomeTeamPlayers(playersFromCall.slice(0, 16))
        setAwayTeamPlayers(playersFromCall.slice(16, 32))
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <TabList
                defaultActiveKey={8}
                tabStyle="bar"
            >
                <StyledLink to="/1">
                    <Tab
                        tabKey={1}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="pin" /><span style={{ paddingLeft: '4px' }}>Home{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink to="/2">
                    <Tab
                        tabKey={2}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="plus" /><span style={{ paddingLeft: '4px' }}>Mint{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink to="/3">
                    <Tab
                        tabKey={3}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="grid" />{' '}<span style={{ paddingLeft: '4px' }}>Collection{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink to="/4">
                    <Tab
                        tabKey={4}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="user" />{' '}<span style={{ paddingLeft: '4px' }}>My players{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink to="/teams/0/0">
                    <Tab
                        tabKey={5}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="link" />{' '}<span style={{ paddingLeft: '4px' }}>Teams{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink to="/6">
                    <Tab
                        tabKey={6}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="list" />{' '}<span style={{ paddingLeft: '4px' }}>Tranfers & Loans{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink to="/7">
                    <Tab
                        tabKey={7}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="calendar" />{' '}<span style={{ paddingLeft: '4px' }}>Competition{' '}</span></div>}
                    />
                </StyledLink>
                <Tab
                    tabKey={8}
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="lifeRing" />{' '}<span style={{ paddingLeft: '4px' }}>Game{' '}</span></div>}
                >
                    <Content>
                        <SignUpPlayer key="1" gameId={gameId} teamId={homeTeam} teamLayout={homeTeamLayout} teamPlayers={homeTeamPlayers} />
                        <SignUpPlayer key="2" gameId={gameId} teamId={awayTeam} teamLayout={awayTeamLayout} teamPlayers={awayTeamPlayers} />
                    </Content>
                </Tab>
            </TabList>
        </Wrapper>
    )
}

export default OnGoingGame