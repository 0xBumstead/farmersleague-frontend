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
    vertical-align: top;
    flex-direction: column;
    justify-content: space-around;
`

export const Image = styled.img`
    cursor: pointer;
    max-width: 300px;

    :hover {
        opacity: 0.8;
    }
`

export const SelectedImage = styled.img`
    cursor: pointer;
    max-width: 300px;
    opacity: 0.3;
`

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`