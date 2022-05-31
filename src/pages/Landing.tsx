import React, { useMemo } from 'react'
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

    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/')
    const seaport = new OpenSeaPort(provider, {
        networkName: Network.Rinkeby,
        apiKey: process.env.REACT_APP_API_KEY
    })

    const handleBuy = async () => {
        const order = await seaport.api.getOrder({ side: OrderSide.Sell })
        const accountAddress = "0x..." // The buyer's wallet address, also the taker
        const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
    }

    useMemo(async() => {
        const asset: OpenSeaAsset = await seaport.api.getAsset({
            tokenAddress: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656', // string
            tokenId: '340963276596901265695437748819921892772811357280503139054330958001333075969', // string | number | null
          })          
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
            <NFTCard>
                <Button onClick={handleBuy}>Buy</Button>
            </NFTCard>
        </StyledContainer>
    )
}

const NFTCard = styled(Card)`
`

const StyledContainer = styled(Box)`
    padding: 32px;
`

export default Landing