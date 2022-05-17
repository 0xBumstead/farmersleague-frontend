import React from "react"
import { useParams } from "react-router-dom"
import { TabList, Tab, Icon } from "web3uikit"
import PlayerCard from "../PlayerCard"
import PlayerTeam from "../PlayerTeam"
import Claim from "../Claim"
import { Wrapper, Content, StyledLink } from "./Player.styles"

const Player = () => {
    const { objectId } = useParams()

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
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="lifeRing" />{' '}<span style={{ paddingLeft: '4px' }}>Player{' '}</span></div>}
                >
                    <Content>
                        <PlayerCard tokenId={objectId} clickable={false} />
                        <PlayerTeam tokenId={objectId} />
                        <Claim tokenId={objectId} />
                    </Content>
                </Tab>
            </TabList>
        </Wrapper>
    )
}

export default Player