import React from "react"
import { useParams } from "react-router-dom"
import DefaultTabBar from "../DefaultTabBar"
import { Wrapper } from "./Home.styles"


const Home = () => {
    const { tabId } = useParams(1)

    return (
        <Wrapper>
            <DefaultTabBar defaultTab={tabId} />
        </Wrapper>
    )
}


export default Home


