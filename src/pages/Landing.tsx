import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Card } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'
import { OpenSeaPort, Network } from 'opensea-js'
import { OrderSide, OpenSeaAsset } from 'opensea-js/lib/types'
import { MnemonicWalletSubprovider } from '@0x/subproviders'
import RPCSubprovider from 'web3-provider-engine/subproviders/rpc'
import Web3ProviderEngine from 'web3-provider-engine'

interface Props {
    setOpen: any;
}

const Landing: React.FC<Props> = ({ setOpen }) => {
    const { account } = useWeb3React()
    const [asset, setAsset] = useState<OpenSeaAsset>()
    const [seaport, setSeaport] = useState<OpenSeaPort>()
    const [doing, setDoing] = useState(false)

    const handleBuy = async () => {
        if (seaport && account) {
            setDoing(true)
            try {
                const order = await seaport.api.getOrder({ side: OrderSide.Sell })
                const transactionHash = await seaport.fulfillOrder({ order, accountAddress: account })
                console.log(transactionHash)
            } catch (e) {
                console.log(e)
            }
            setDoing(false)
        }
    }

    useMemo(async () => {
        const MNEMONIC = process.env.REACT_APP_MNEMONIC ?? ''
        const INFURA_KEY = process.env.REACT_APP_INFURA_KEY ?? ''
        const BASE_DERIVATION_PATH = `44'/60'/0'/0`
        const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({ mnemonic: MNEMONIC, baseDerivationPath: BASE_DERIVATION_PATH })
        const infuraRpcSubprovider = new RPCSubprovider({
            rpcUrl: 'https://rinkeby.infura.io/v3/' + INFURA_KEY,
        })
        const providerEngine = new Web3ProviderEngine()
        providerEngine.addProvider(mnemonicWalletSubprovider)
        providerEngine.addProvider(infuraRpcSubprovider)

        const _seaport = new OpenSeaPort(providerEngine, {
            networkName: Network.Rinkeby,
        })
        const _asset: OpenSeaAsset = await _seaport.api.getAsset({
            tokenAddress: '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656', // string
            tokenId: '340963276596901265695437748819921892772811357280503139054330958001333075969', // string | number | null
        })
        setSeaport(_seaport)
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
                        <Button color='secondary' variant='contained' onClick={handleBuy} disabled={!account || doing}>Buy</Button>
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