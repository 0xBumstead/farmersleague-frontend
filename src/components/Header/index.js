import React from "react"
import { ConnectButton } from "web3uikit"
import { Wrapper, Content } from "./Header.styles"

const Header = () => {

    return (
        <Wrapper>
            <Content>
                <ConnectButton moralisAuth={true} />
            </Content>
        </Wrapper>
    )
}

export default Header