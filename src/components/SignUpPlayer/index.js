import React, { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import { Wrapper, Content } from "./SignUpPlayer.styles"
import { contractAddresses, abi_PlayerRate, layoutNumber, positionsNumber } from "../../constants"

const SignUpPlayer = ({ gameId, teamId, teamLayout, teamPlayers }) => {


    return (
        <Wrapper>
            <Content>
                This is the SignUpPlayer component for gameId: {gameId} and teamId: {teamId}
            </Content>
        </Wrapper>
    )
}

SignUpPlayer.propTypes = {
    gameId: PropTypes.number,
    teamId: PropTypes.number,
    teamLayout: PropTypes.number,
    teamPlayers: PropTypes.arrayOf(PropTypes.object)
}

export default SignUpPlayer

