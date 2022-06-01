import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Card } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'
import { OpenSeaPort, Network } from 'opensea-js'
import { OrderSide, OpenSeaAsset } from 'opensea-js/lib/types'
import Web3 from 'web3'

interface Props {
    setOpen: any;
}

const Landing: React.FC<Props> = ({ setOpen }) => {
    const { account } = useWeb3React()
    const [asset, setAsset] = useState<OpenSeaAsset>()

    const handleBuy = async () => {
        const provider1 = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/bb0e99ebaece4ea4bf1d2820cf1d0e23')
        const seaport1 = new OpenSeaPort(provider1, {
            networkName: Network.Rinkeby,
        })
        const order = await seaport1.api.getOrder({ side: OrderSide.Sell })
        if (account) {
            const transactionHash = await seaport1.fulfillOrder({ order, accountAddress: account })
            console.log(transactionHash)
        }
    }

    useMemo(async () => {
        const provider1 = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/bb0e99ebaece4ea4bf1d2820cf1d0e23')
        const seaport1 = new OpenSeaPort(provider1, {
            networkName: Network.Rinkeby,
        })
        const _asset: OpenSeaAsset = await seaport1.api.getAsset({
            tokenAddress: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656', // string
            tokenId: '340963276596901265695437748819921892772811357280503139054330958001333075969', // string | number | null
        })
        setAsset(_asset)
    }, [])

    return (
        <StyledContainer>
            <Box display={'flex'} justifyContent='space-between' color={'white'}>
                NFT card shows from Opensea
                {account ? <Button color='primary' variant='contained'>{account}</Button>
                    :
                    <Button color='primary' variant='contained' onClick={() => setOpen(true)}>connect wallet</Button>
                }
            </Box>
            <Box mt={10}>
                {asset ?
                    <NFTCard>
                        <Box>
                            <img src={asset?.imageUrl} alt='' />
                        </Box>
                        <Button color='secondary' variant='contained' onClick={handleBuy}>Buy</Button>
                    </NFTCard>
                    :
                    <Spinner width='40px' height='40px'>
                        <svg viewBox='0 0 120 120'>
                            <circle cx='60' cy='60' r='50' />
                        </svg>
                    </Spinner>
                }
            </Box>
        </StyledContainer>
    )
}

const Spinner = styled(Box)`
    @keyframes inner {
        0% {
            stroke-dashoffset: 187;
        }

        25% {
            stroke-dashoffset: 80;
        }

        100% {
            stroke-dashoffset: 187;
            transform: rotate(360deg);
        }
    }
    >svg {
        transform: rotate(-90deg);
        stroke-linecap: round;
        stroke-width: 4;
        fill: none;
        overflow: hidden;
        width: 32px;
        height: 32px;
        >circle:first-of-type {
            stroke-dashoffset: 0;
            transform-origin: center center;
            stroke-dasharray: 312;
            animation: 1s linear 0s infinite normal none running inner;
            stroke: white;
        }
    }
`

const NFTCard = styled(Card)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: fit-content;
`

const StyledContainer = styled(Box)`
    padding: 32px;
`

export default Landing