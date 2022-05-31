import ERC20_ABI from 'builds/ERC20.json'
import Farm_ABI from 'builds/Farm_ABI.json'

export const ROUTERS = {
    Farm: {
        abi: Farm_ABI,
        address: '0xfda1cf6261dcabaa29b3e464f78717ffb54b8a63',
    },
    PAX: {
        abi: ERC20_ABI,
        address: '0x3fD5D987eee6b6d5E590835DA55a12cf5658307d',
    },
}