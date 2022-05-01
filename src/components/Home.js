import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
    background: var(--darkGrey);
    margin: auto auto -20px auto;
    color: var(--white);
`

const Home = () => {
    return (
        <>
            <Wrapper>
                This is the home component
            </Wrapper>
        </>
    )
}

export default Home


