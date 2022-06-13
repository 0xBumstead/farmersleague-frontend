import React, { useEffect, useState } from "react"
import { useMoralis, useMoralisWeb3Api, useWeb3Contract } from "react-moralis"
import PropTypes from "prop-types"
import { Wrapper, Content, Image } from "./TeamSignedUp.styles"
import { contractAddresses, eventTopics, abi_LeagueGame, abi_event_teamChallenged } from "../../constants"
import img_00 from "../../images/00_5-4-1.png"
import img_01 from "../../images/01_5-4-1.png"
import img_02 from "../../images/02_5-4-1.png"
import img_03 from "../../images/03_5-3-2.png"
import img_04 from "../../images/04_5-3-2.png"
import img_05 from "../../images/05_4-5-1.png"
import img_06 from "../../images/06_4-5-1.png"
import img_07 from "../../images/07_4-4-2.png"
import img_08 from "../../images/08_4-4-2.png"
import img_09 from "../../images/09_4-3-3.png"
import img_10 from "../../images/10_4-3-3.png"
import img_11 from "../../images/11_3-5-2.png"
import img_12 from "../../images/12_3-5-2.png"
import img_13 from "../../images/13_3-4-3.png"

const TeamSignedUp = ({ teamId }) => {

    const { Moralis, isWeb3Enabled } = useMoralis()
    const Web3Api = useMoralisWeb3Api({})

    const leagueGameAddress = contractAddresses["LeagueGame"]
    const challengeTopic = eventTopics["teamChallenged"]
    const ABI = abi_LeagueGame
    const teamChallengedABI = abi_event_teamChallenged

    const [inGameStatus, setInGameStatus] = useState("0")
    const [layout, setLayout] = useState("0")
    const [stake, setStake] = useState(0)
    const [challengingTeam, setChallengingTeam] = useState(0)
    const [challengedTeam, setChallengedTeam] = useState(0)

    const { runContractFunction: getTeamStatus } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 0 }
    })

    const { runContractFunction: getLayout } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 2 }
    })

    const { runContractFunction: getStake } = useWeb3Contract({
        abi: ABI,
        contractAddress: leagueGameAddress,
        functionName: "teamGame",
        params: { _teamId: teamId, _rank: 3 }
    })


    const updateUIValues = async () => {
        const inGameStatusFromCall = (await getTeamStatus()).toString()
        const layoutFromCall = (await getLayout()).toString()
        const stakeFromCall = Moralis.Units.FromWei(await getStake())
        const events = await Web3Api.native.getContractEvents({
            chain: "mumbai",
            abi: teamChallengedABI,
            address: leagueGameAddress,
            topic: challengeTopic
        })
        const challenges = events.result
        if (inGameStatusFromCall === "2") {
            for (let index = 0; index < challenges.length; index++) {
                if (challenges[index].data["challengingTeamId"] === teamId.toString()) {
                    setChallengedTeam(challenges[index].data["challengedTeamId"])
                    break
                }
            }
        }
        if (inGameStatusFromCall === "3") {
            for (let index = 0; index < challenges.length; index++) {
                if (challenges[index].data["challengedTeamId"] === teamId.toString()) {
                    setChallengingTeam(challenges[index].data["challengingTeamId"])
                    break
                }
            }
        }
        setInGameStatus(inGameStatusFromCall)
        setLayout(layoutFromCall)
        setStake(stakeFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <h1>Competition Situation</h1>
            <Content>
                {(inGameStatus === "0") ? (
                    <p>The team is not ready yet</p>
                ) : (
                    <>
                        <p>
                            Status: {(inGameStatus === "1") ? (
                                `The team is waiting for an opponent, with ${stake} KICK tokens at stake`
                            ) : ((inGameStatus === "2") ? (
                                `The team is challenging team #${challengedTeam}`
                            ) : ((inGameStatus === "3") ? (
                                `The team is challenged by team #${challengingTeam}`
                            ) : (
                                "The team has a game set"
                            )))}
                        </p>
                        {(layout === "0") ? (
                            <Image src={img_00} />
                        ) : (
                            <></>
                        )}
                        {(layout === "1") ? (
                            <Image src={img_01} />
                        ) : (
                            <></>
                        )}
                        {(layout === "2") ? (
                            <Image src={img_02} />
                        ) : (
                            <></>
                        )}
                        {(layout === "3u") ? (
                            <Image src={img_03} />
                        ) : (
                            <></>
                        )}
                        {(layout === "4") ? (
                            <Image src={img_04} />
                        ) : (
                            <></>
                        )}
                        {(layout === "5") ? (
                            <Image src={img_05} />
                        ) : (
                            <></>
                        )}
                        {(layout === "6") ? (
                            <Image src={img_06} />
                        ) : (
                            <></>
                        )}
                        {(layout === "7") ? (
                            <Image src={img_07} />
                        ) : (
                            <></>
                        )}
                        {(layout === "8") ? (
                            <Image src={img_08} />
                        ) : (
                            <></>
                        )}
                        {(layout === "9") ? (
                            <Image src={img_09} />
                        ) : (
                            <></>
                        )}
                        {(layout === "10") ? (
                            <Image src={img_10} />
                        ) : (
                            <></>
                        )}
                        {(layout === "11") ? (
                            <Image src={img_11} />
                        ) : (
                            <></>
                        )}
                        {(layout === "12") ? (
                            <Image src={img_12} />
                        ) : (
                            <></>
                        )}
                        {(layout === "13") ? (
                            <Image src={img_13} />
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </Content>
        </Wrapper>
    )
}

TeamSignedUp.propTypes = {
    teamId: PropTypes.number
}

export default TeamSignedUp