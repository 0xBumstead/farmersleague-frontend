import styled from "styled-components"


export const Wrapper = styled.div`
    max-width: var(--maxWidth);
    margin: auto auto -20px auto;
    padding: 0 20px;
    color: var(--white);
`

export const Content = styled.div`
    display: flex;
    align-items: center;
    vertical-align: top;
    flex-direction: column;
    justify-content: space-around;

    h1 {
        color: var(--lightGrey);

        @media screen and (max-width: 768px) {
            font-size: var(--fontL);
        }
    }
`


export const Image = styled.img`
    max-width: 300px;
`