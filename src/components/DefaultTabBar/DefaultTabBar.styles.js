import styled from "styled-components"
import { Link } from "react-router-dom"

export const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    vertical-align: top;
    padding: 30px 0;
`

export const Content = styled.div`
    padding: 30px 0;
`

export const Text = styled.div`
    max-width: 600px;

    h1 {
        color: var(--lightGrey);
    }
`

export const Image = styled.img`
    max-height: 800px;
`
