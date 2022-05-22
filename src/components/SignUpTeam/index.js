import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { TabList, Tab, Icon, useNotification, Input } from "web3uikit"
import ContractButton from "../ContractButton"
import Grid from "../Grid"
import { Wrapper, Content, ButtonWrapper, Image, StyledLink, SelectedImage } from "./SignUpTeam.styles"
import { contractAddresses, abi_KickToken, abi_LeagueGame } from "../../constants"
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

const SignUpTeam = () => {

    const { objectId } = useParams()
    const dispatch = useNotification()
    const { Moralis, user, isWeb3Enabled } = useMoralis()
    const navigate = useNavigate()

    const [kickBalance, setKickBalance] = useState(0)
    const [kickAllowance, setKickAllowance] = useState(0)
    const [minSignUpPrice, setMinSignUpPrice] = useState(0)
    const [layout, setLayout] = useState(0)
    const [stake, setStake] = useState(0)

    const kickTokenAddress = contractAddresses["KickToken"]
    const kickTokenABI = abi_KickToken
    const leagueGameAddress = contractAddresses["LeagueGame"]
    const leagueGameABI = abi_LeagueGame
    const walletAddress = user.get("ethAddress")

    const { runContractFunction: getKickBalance } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "balanceOf",
        params: { account: walletAddress },
    })

    const { runContractFunction: getKickAllowance } = useWeb3Contract({
        abi: kickTokenABI,
        contractAddress: kickTokenAddress,
        functionName: "allowance",
        params: { owner: walletAddress, spender: leagueGameAddress },
    })

    const { runContractFunction: getMinSignUpPrice } = useWeb3Contract({
        abi: leagueGameABI,
        contractAddress: leagueGameAddress,
        functionName: "prices",
        params: { _rank: 0 }
    })

    const updateUIValues = async () => {
        const kickBalanceFromCall = Moralis.Units.FromWei(await getKickBalance())
        const kickAllowanceFromCall = Moralis.Units.FromWei(await getKickAllowance())
        const minSignUpPriceFromCall = Moralis.Units.FromWei(await getMinSignUpPrice())
        setKickBalance(kickBalanceFromCall)
        setKickAllowance(kickAllowanceFromCall)
        setMinSignUpPrice(minSignUpPriceFromCall)
        setStake(minSignUpPriceFromCall)
    }

    const updateApproval = async () => {
        const kickAllowanceFromCall = Moralis.Units.FromWei(await getKickAllowance())
        setKickAllowance(kickAllowanceFromCall)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const approveSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateApproval()
    }

    const txSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        navigate("/teams/0")
    }

    const handleClick = async (layoutFromClick) => {
        setLayout(layoutFromClick)
    }

    const handleInput = (event) => {
        setStake(event.target.value)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <Wrapper>
            <TabList
                defaultActiveKey={8}
                tabStyle="bar"
            >
                <StyledLink key="sl1" to="/1">
                    <Tab
                        tabKey={1}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="pin" /><span style={{ paddingLeft: '4px' }}>Home{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl2" to="/2">
                    <Tab
                        tabKey={2}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="plus" /><span style={{ paddingLeft: '4px' }}>Mint{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl3" to="/3">
                    <Tab
                        tabKey={3}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="grid" />{' '}<span style={{ paddingLeft: '4px' }}>Collection{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl4" to="/4">
                    <Tab
                        tabKey={4}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="user" />{' '}<span style={{ paddingLeft: '4px' }}>My players{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl5" to="/teams/0">
                    <Tab
                        tabKey={5}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="link" />{' '}<span style={{ paddingLeft: '4px' }}>Teams{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl6" to="/6">
                    <Tab
                        tabKey={6}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="list" />{' '}<span style={{ paddingLeft: '4px' }}>Tranfers & Loans{' '}</span></div>}
                    />
                </StyledLink>
                <StyledLink key="sl7" to="/7">
                    <Tab
                        tabKey={7}
                        tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="calendar" />{' '}<span style={{ paddingLeft: '4px' }}>Competition{' '}</span></div>}
                    />
                </StyledLink>
                <Tab
                    tabKey={8}
                    tabName={<div style={{ display: 'flex' }}><Icon fill="#eee" size={22} svg="lifeRing" />{' '}<span style={{ paddingLeft: '4px' }}>Sign Up{' '}</span></div>}
                >
                    <Content>
                        <Grid header="Select a layout">
                            {layout === 0 ? (
                                <SelectedImage key="s_img_00" src={img_00} onClick={() => handleClick(0)} />
                            ) : (
                                <Image key="img_00" src={img_00} onClick={() => handleClick(0)} />
                            )}
                            {layout === 1 ? (
                                <SelectedImage key="s_img_01" src={img_01} onClick={() => handleClick(1)} />
                            ) : (
                                <Image key="img_01" src={img_01} onClick={() => handleClick(1)} />
                            )}
                            {layout === 2 ? (
                                <SelectedImage key="s_img_02" src={img_02} onClick={() => handleClick(2)} />
                            ) : (
                                <Image key="img_02" src={img_02} onClick={() => handleClick(2)} />
                            )}
                            {layout === 3 ? (
                                <SelectedImage key="s_img_03" src={img_03} onClick={() => handleClick(3)} />
                            ) : (
                                <Image key="img_03" src={img_03} onClick={() => handleClick(3)} />
                            )}
                            {layout === 4 ? (
                                <SelectedImage key="s_img_04" src={img_04} onClick={() => handleClick(4)} />
                            ) : (
                                <Image key="img_04" src={img_04} onClick={() => handleClick(4)} />
                            )}
                            {layout === 5 ? (
                                <SelectedImage key="s_img_05" src={img_05} onClick={() => handleClick(5)} />
                            ) : (
                                <Image key="img_05" src={img_05} onClick={() => handleClick(5)} />
                            )}
                            {layout === 6 ? (
                                <SelectedImage key="s_img_06" src={img_06} onClick={() => handleClick(6)} />
                            ) : (
                                <Image key="img_06" src={img_06} onClick={() => handleClick(6)} />
                            )}
                            {layout === 7 ? (
                                <SelectedImage key="s_img_07" src={img_07} onClick={() => handleClick(7)} />
                            ) : (
                                <Image key="img_07" src={img_07} onClick={() => handleClick(7)} />
                            )}
                            {layout === 8 ? (
                                <SelectedImage key="s_img_08" src={img_08} onClick={() => handleClick(8)} />
                            ) : (
                                <Image key="img_08" src={img_08} onClick={() => handleClick(8)} />
                            )}
                            {layout === 9 ? (
                                <SelectedImage key="s_img_09" src={img_09} onClick={() => handleClick(9)} />
                            ) : (
                                <Image key="img_09" src={img_09} onClick={() => handleClick(9)} />
                            )}
                            {layout === 10 ? (
                                <SelectedImage key="s_img_10" src={img_10} onClick={() => handleClick(10)} />
                            ) : (
                                <Image key="img_10" src={img_10} onClick={() => handleClick(10)} />
                            )}
                            {layout === 11 ? (
                                <SelectedImage key="s_img_11" src={img_11} onClick={() => handleClick(11)} />
                            ) : (
                                <Image key="img_11" src={img_11} onClick={() => handleClick(11)} />
                            )}
                            {layout === 12 ? (
                                <SelectedImage key="s_img_12" src={img_12} onClick={() => handleClick(12)} />
                            ) : (
                                <Image key="img_12" src={img_12} onClick={() => handleClick(12)} />
                            )}
                            {layout === 13 ? (
                                <SelectedImage key="s_img_13" src={img_13} onClick={() => handleClick(13)} />
                            ) : (
                                <Image key="img_13" src={img_13} onClick={() => handleClick(13)} />
                            )}
                        </Grid>
                        <ButtonWrapper>
                            <Input
                                label="KICK Tokens to stake"
                                name="kickInput"
                                onBlur={handleInput}
                                onChange={handleInput}
                                value={stake}
                            />
                            <p>Min Sign Up Price: {minSignUpPrice} KICK / You have : {kickBalance}</p>
                            {(parseInt(kickAllowance) < parseInt(stake)) ? (
                                <ContractButton
                                    abi={kickTokenABI}
                                    address={kickTokenAddress}
                                    functionName="approve"
                                    params={{ spender: leagueGameAddress, amount: Moralis.Units.ETH(100000000) }}
                                    text="Approve KICK Token"
                                    callback={approveSuccess}
                                    disabled={false}
                                />
                            ) : (
                                <ContractButton
                                    abi={leagueGameABI}
                                    address={leagueGameAddress}
                                    functionName="signUpTeam"
                                    msgValue={"0"}
                                    params={{ _teamId: objectId, _layout: layout, _stake: Moralis.Units.ETH(stake) }}
                                    text="Sign up the team"
                                    callback={txSuccess}
                                    disabled={false}
                                />
                            )}
                        </ButtonWrapper>
                    </Content>
                </Tab>
            </TabList>
        </Wrapper >
    )
}

export default SignUpTeam