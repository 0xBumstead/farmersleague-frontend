import styled from "styled-components"
import { Link } from "react-router-dom"

export const Wrapper = styled.div`
    background: var(--medGrey);
    width: 300px;
    border-radius: 20px;
    padding: 5px;
    display: flex;
    align-items: center;
    vertical-align: top;
    flex-direction: column;
    color: var(--white);

    h3 {
        margin: 10px 0 0 0;
    }

    p {
        margin: 5px 0;
        text-align: center;
    }

`

export const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    vertical-align: top;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
`