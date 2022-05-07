import styled from "styled-components"

export const Wrapper = styled.div`
    background: var(--darkGrey);
    padding: 0 20px;
`

export const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    padding: 20px 0;
    color: var(--white);

    a {
        color: var(--white);
        text-decoration: none;
    }
`