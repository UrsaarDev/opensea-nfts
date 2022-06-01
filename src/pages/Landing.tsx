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

    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/bb0e99ebaece4ea4bf1d2820cf1d0e23')
    const seaport = new OpenSeaPort(provider, {
        networkName: Network.Rinkeby,
        apiKey: 'bb0e99ebaece4ea4bf1d2820cf1d0e23'
    })

    const handleBuy = async () => {
        const order = await seaport.api.getOrder({ side: OrderSide.Sell })
        const accountAddress = "0x..." // The buyer's wallet address, also the taker
        const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
    }

    useMemo(async () => {
        const provider1 = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/bb0e99ebaece4ea4bf1d2820cf1d0e23')
        const seaport1 = new OpenSeaPort(provider1, {
            networkName: Network.Rinkeby,
            apiKey: 'bb0e99ebaece4ea4bf1d2820cf1d0e23'
        })
        const _asset: OpenSeaAsset = await seaport1.api.getAsset({
            tokenAddress: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656', // string
            tokenId: '340963276596901265695437748819921892772811357280503139054330958001333075969', // string | number | null
        })
        console.log(_asset)
        setAsset(_asset)
    }, [])

    return (
        <StyledContainer>
            <Box display={'flex'} justifyContent='space-between'>
                NFT card shows from Opensea
                {account ? <Button color='primary' variant='contained'>{account}</Button>
                    :
                    <Button color='primary' variant='contained' onClick={() => setOpen(true)}>connect wallet</Button>
                }
            </Box>
            <Box mt={10}>
                <NFTCard>
                    <Box>ddf</Box>
                    <Button color='secondary' variant='contained' onClick={handleBuy}>Buy</Button>
                </NFTCard>
            </Box>
        </StyledContainer>
    )
}

const NFTCard = styled(Card)`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: fit-content;
`

const StyledContainer = styled(Box)`
    padding: 32px;
`

export default Landing