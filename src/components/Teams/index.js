import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon } from "web3uikit"
import Grid from "../Grid"
import TeamCard from "../TeamCard"
import { Wrapper, StyledLink } from "./Teams.styles"
import { contractAddresses, abi_LeagueTeam } from "../../constants"

const Teams = () => {
    const { objectId, paramId } = useParams()
    const { isWeb3Enabled } = useMoralis()
    const [teamsList, setTeamsList] = useState([])

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const ABI = abi_LeagueTeam

    const { runContractFunction: nbOfTeams } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueTeamAddress,
        functionName: "nbOfTeams",
        params: {},
    })

    const updateUIValues = async () => {
        const nbOfTeamsFromCall = await nbOfTeams()
        let teamsListFromCall = []
        for (let index = 1; index <= nbOfTeamsFromCall; index++) {
            teamsListFromCall.push(index)
        }
        setTeamsList(teamsListFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <TabList
                defaultActiveKey={5}
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
                <Tab
                    tabKey={5}
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="link" />{' '}<span style={{ paddingLeft: '4px' }}>Teams{' '}</span></div>}
                >
                    <Grid header="Teams">
                        {teamsList.map(id => (
                            <TeamCard key={id} teamId={id} tokenId={parseInt(objectId)} teamChallenging={parseInt(paramId)} clickable />
                        ))}
                    </Grid>
                </Tab>

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
            </TabList>
        </Wrapper>
    )
}

export default Teams