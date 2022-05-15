import styled from "styled-components"
import { Link } from "react-router-dom"


export const Wrapper = styled.div`
    background: var(--medGrey);
    height: 480px;
    width: 300px;
    border-radius: 20px;
    padding: 5px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    color: var(--white);

    h3 {
        margin: 5px 0 0 0;
    }

    p {
        margin: 2px 0;
    }
`
export const Image = styled.img`
    display: block;
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 15px;
`

export const StyledLink = styled(Link)`
    height: 480px;
    text-decoration: none;
    color: inherit;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
`