import React, { useEffect, useState } from "react"
import { useMoralis, useMoralisWeb3Api } from "react-moralis"
import { useParams } from "react-router-dom"
import { TabList, Tab, Icon } from "web3uikit"
import DeclineChallenge from "../DeclineChallenge"
import { Wrapper, StyledLink } from "./Challenge.styles"
import { contractAddresses, eventTopics, abi_event_teamChallenged } from "../../constants"

const Challenge = () => {

    const { objectId, paramId } = useParams()
    const { isWeb3Enabled } = useMoralis()
    const Web3Api = useMoralisWeb3Api({})

    const [challengingTeam, setChallengingTeam] = useState(0)

    const leagueGameAddress = contractAddresses["LeagueGame"]
    const teamChallengedABI = abi_event_teamChallenged
    const challengeTopic = eventTopics["teamChallenged"]

    const updateUIValues = async () => {
        const events = await Web3Api.native.getContractEvents({
            chain: "mumbai",
            abi: teamChallengedABI,
            address: leagueGameAddress,
            topic: challengeTopic
        })
        const challenges = events.result
        for (let index = 0; index < challenges.length; index++) {
            if (challenges[index].data["challengedTeamId"] === objectId) {
                setChallengingTeam(challenges[index].data["challengingTeamId"])
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
                <StyledLink to="/teams/0">
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
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="lifeRing" />{' '}<span style={{ paddingLeft: '4px' }}>Challenge{' '}</span></div>}
                >
                    <DeclineChallenge challengedTeam={parseInt(objectId)} challengingTeam={parseInt(challengingTeam)} captainId={parseInt(paramId)} />                </Tab>
            </TabList>
        </Wrapper>
    )
}

export default Challenge