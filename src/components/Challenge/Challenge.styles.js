import styled from "styled-components"
import { Link } from "react-router-dom"

export const Wrapper = styled.div`
    margin: auto auto -20px auto;
    padding: 0 20px;
    color: var(--white);
`

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`