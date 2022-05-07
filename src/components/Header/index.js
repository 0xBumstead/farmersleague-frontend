import React from "react"
import { ConnectButton } from "web3uikit"
import { Wrapper, Content } from "./Header.styles"

const Header = () => {

    return (
        <Wrapper>
            <Content>
                <h1>FARMERS LEAGUE / VERIFIABLE RANDOM FOOTBALLERS</h1>
                <></>
                <ConnectButton moralisAuth={true} />
            </Content>
        </Wrapper>
    )
}

export default Header