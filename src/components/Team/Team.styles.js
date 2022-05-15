import styled from "styled-components"
import { Link } from "react-router-dom"

export const Wrapper = styled.div`
    margin: auto auto -20px auto;
    padding: 0 20px;
    color: var(--white);
`

export const Content = styled.div`
`

export const ButtonWrapper = styled.div`
    padding: 20px 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
`

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`