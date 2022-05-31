import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Box, Button } from '@material-ui/core'
import { parseEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { useContract, usePAXContract } from 'hooks/useContracts'
import { ROUTERS } from 'config'

interface Props {
    setOpen: any;
}

const Landing: React.FC<Props> = ({ setOpen }) => {
    const { account } = useWeb3React()
    const farmContract = useContract(ROUTERS.Farm.address, ROUTERS.Farm.abi)
    const tokenContract = usePAXContract()

    const [deposited, setDeposited] = useState(0)
    const [apr, setAPR] = useState(0)
    const [count, setCount] = useState(0)
    const [doing, setDoing] = useState(false)
    const [amount, setAmount] = useState('0')
    useMemo(async () => {
        if (account && count >= 0) {
            const _decimal = await tokenContract?.decimals().call()
            const _deposited = parseFloat(await farmContract?.depositedTokens(account).call()) / (10 ** parseInt(_decimal))
            const _total = parseFloat(await farmContract?.totalTokens().call()) / (10 ** parseInt(_decimal))
            setDeposited(_deposited)
            setAPR((_deposited / _total) * 100)
        }
    }, [account, count, tokenContract, farmContract])

    const onApprove = async () => {
        setDoing(true)
        try {
            await tokenContract?.approve(ROUTERS.Farm.address, '10000000000000000000000000000').send({ from: account }).on('transactionHash', (hash: any) => {
                alert('confirm')
            })
            setCount(prev => prev + 1)
        } catch (e) { console.log(e) }
        setDoing(false)
    }

    const onStakeUnStake = async (stake: boolean) => {
        setDoing(true)
        try {
            if (stake) await farmContract?.deposit(parseEther(amount).toString()).send({ from: account })
            else await farmContract?.withdraw(parseEther(amount).toString()).send({ from: account })
            setCount(prev => prev + 1)
        } catch (e) {
            console.log(e)
        }
        setDoing(false)
    }

    const onClaim = async () => {
        setDoing(true)
        try {
            await farmContract?.claim().send({ from: account })
            setCount(prev => prev + 1)
        } catch (e) {
            console.log(e)
        }
        setDoing(false)
    }
    return (
        <StyledContainer>
            <Box display={'flex'} justifyContent='space-between'>
                Landing
                {account ? <Button color='primary' variant='contained'>{account}</Button>
                    :
                    <Button color='primary' variant='contained' onClick={() => setOpen(true)}>connect wallet</Button>
                }
            </Box>
            <Button color='primary' variant='contained' disabled={!account || doing} onClick={onApprove}>Enable</Button>
            <Box mt={3} display='flex' gridColumnGap={10}>
                <input type='text' value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Button color='primary' variant='contained' disabled={!account || doing} onClick={() => onStakeUnStake(true)}>Stake</Button>
                <Button color='secondary' variant='contained' disabled={!account || doing} onClick={() => onStakeUnStake(false)}>Unstake</Button>
            </Box>
            <Box>Staked: {deposited.toFixed(2)}</Box>
            <Box>APR: {apr.toFixed(2)}%</Box>
            <Box mt={3} display='flex' gridColumnGap={10}>
                <Button color='primary' variant='contained' disabled={!account || doing} onClick={onClaim}>claim</Button>
            </Box>
        </StyledContainer>
    )
}

const StyledContainer = styled(Box)`
`

export default Landing