import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
    :root {
        --maxWidth: 1280px;
        --white: #fff;
        --lightGrey: #eee;
        --medGrey: #353535;
        --darkGrey: #1C1C1C;
        --fontXL: 2.5rem;
        --fontL: 1.5rem;
        --fontM: 1.2rem;
        --fontS: 1rem;
    }

    * {
        box-sizing: border-box;
        font-family: "Abel", sans-serif;
    }

    body {
        margin: 0;
        padding: 0;
        height: 100%;
        background: var(--darkGrey);

        h1 {
            font-size: 2rem;
            font-weight: 600;
            color: var(--white);
        }

        h3 {
            font-size: 1.1rem;
            font-weight: 600;
        }

        p {
            font-size: 1rem;
            color: var(--white);
        }

        p2 {
            font-size: 0.75rem;
            color: var(--white);
        }
    }
`