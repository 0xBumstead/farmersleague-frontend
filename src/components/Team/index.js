import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon, useNotification } from "web3uikit"
import PlayerCard from "../PlayerCard"
import Grid from "../Grid"
import ContractButton from "../ContractButton"
import TeamSignedUp from "../TeamSignedUp"
import { Wrapper, Content, ButtonWrapper, StyledLink } from "./Team.styles"
import { contractAddresses, abi_LeagueTeam } from "../../constants"

const Team = () => {

    const { objectId, paramId } = useParams()
    const dispatch = useNotification()
    const { isWeb3Enabled } = useMoralis()

    const [tokenId, setTokenId] = useState(paramId)
    const [teamMembers, setTeamMembers] = useState([])
    const [teamApplications, setTeamApplications] = useState([])
    const [captainId, setCaptainId] = useState(0)

    const leagueTeamAddress = contractAddresses["LeagueTeam"]
    const ABI = abi_LeagueTeam

    const { runContractFunction: teamMembersArray } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembersArray",
        params: { _teamId: objectId }
    })

    const { runContractFunction: teamApplicationsArray } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamApplicationsArray",
        params: { _teamId: objectId }
    })

    const { runContractFunction: teamCaptain } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueTeamAddress,
        functionName: "teamMembers",
        params: { _teamId: objectId, _position: 1 }
    })

    const updateUIValues = async () => {
        const teamMembersFromCall = await teamMembersArray()
        const teamApplicationsFromCall = await teamApplicationsArray()
        const captainIdFromCall = await teamCaptain()

        let teamMembersFiltered = []
        for (let index = 0; index < 23; index++) {
            if (teamMembersFromCall[index] !== 0) {
                teamMembersFiltered.push(teamMembersFromCall[index])
            }
        }
        let teamApplicationsFiltered = []
        for (let index = 1; index < teamApplicationsFromCall.length; index++) {
            if (teamApplicationsFromCall[index] !== 0) {
                teamApplicationsFiltered.push(teamApplicationsFromCall[index])
            }
        }
        setTeamMembers(teamMembersFiltered)
        setTeamApplications(teamApplicationsFiltered)
        setCaptainId(captainIdFromCall)
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

    const applySuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        setTokenId(0)
        updateUIValues()
    }

    const txSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUIValues()
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
                <StyledLink key="sl1" to="/1">
                    <Tab
                        tabKey={1}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="pin" /><span style={{ paddingLeft: '4px' }}>Home{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl2" to="/2">
                    <Tab
                        tabKey={2}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="plus" /><span style={{ paddingLeft: '4px' }}>Mint{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl3" to="/3">
                    <Tab
                        tabKey={3}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="grid" />{' '}<span style={{ paddingLeft: '4px' }}>Collection{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl4" to="/4">
                    <Tab
                        tabKey={4}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="user" />{' '}<span style={{ paddingLeft: '4px' }}>My players{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl5" to="/teams/0">
                    <Tab
                        tabKey={5}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="link" />{' '}<span style={{ paddingLeft: '4px' }}>Teams{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl6" to="/6">
                    <Tab
                        tabKey={6}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="list" />{' '}<span style={{ paddingLeft: '4px' }}>Tranfers & Loans{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl7" to="/7">
                    <Tab
                        tabKey={7}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="calendar" />{' '}<span style={{ paddingLeft: '4px' }}>Competition{' '}</span></div>}
                    />
                </StyledLink>
                <Tab
                    tabKey={8}
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="lifeRing" />{' '}<span style={{ paddingLeft: '4px' }}>Team{' '}</span></div>}
                >
                    <Content>
                        <Grid key="g1" header="Team members">
                            {((tokenId - captainId) === 0 && tokenId > 0) ? (
                                teamMembers.map(id => (
                                    <PlayerCard key={"tm" + id} tokenId={id} teamId={parseInt(objectId)} isPlayerTeam captainId={captainId} />
                                ))) : (
                                teamMembers.map(id => (
                                    <PlayerCard key={"tm" + id} tokenId={id} />
                                )))}
                        </Grid>
                        <ButtonWrapper key="bw1">
                            {((tokenId - captainId) !== 0 && tokenId > 0) ? (
                                <ContractButton
                                    abi={ABI}
                                    address={leagueTeamAddress}
                                    functionName="applyForTeam"
                                    params={{ _playerId: tokenId, _teamId: objectId }}
                                    text="Apply for this team"
                                    callback={applySuccess}
                                    disabled={false}
                                />
                            ) : (
                                <></>
                            )}
                        </ButtonWrapper>
                        <Grid key="g2" header="Team applications">
                            {((tokenId - captainId) === 0 && tokenId > 0) ? (
                                teamApplications.map(id => (
                                    <PlayerCard key={"ap" + id} tokenId={id} teamId={parseInt(objectId)} />
                                ))) : (
                                teamApplications.map(id => (
                                    <PlayerCard key={"ap" + id} tokenId={id} />
                                )))}
                        </Grid>
                        <ButtonWrapper key="bw2">
                            {((tokenId - captainId) === 0 && tokenId > 0 && teamApplications.length > 0) ? (
                                <ContractButton
                                    abi={ABI}
                                    address={leagueTeamAddress}
                                    functionName="clearApplications"
                                    params={{ _teamId: objectId }}
                                    text="Decline all the pending applications"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            ) : (
                                <>
                                    {(teamApplications.length > 0) ? (
                                        <></>
                                    ) : [
                                        <p>No pending applications</p>
                                    ]}
                                </>
                            )}
                        </ButtonWrapper>
                        <TeamSignedUp teamId={parseInt(objectId)} />
                    </Content>
                </Tab>
            </TabList>
        </Wrapper>
    )
}

export default Team