import { Token } from '@uniswap/sdk'
import { getOtherNetworkLibrary } from 'connectors/multiNetworkConnectors'
import { useEffect, useMemo, useState } from 'react'
import { getContract, isAddress } from 'utils'
import ERC20_ABI from 'constants/abis/erc20.json'

export function useTokenOtherChain(tokenAddress: string | undefined, chainId?: number): Token | undefined | null {
  const [callRes, setCallRes] = useState<undefined | any[]>(undefined)

  useEffect(() => {
    let mounted = true
    const address = isAddress(tokenAddress)
    const library = getOtherNetworkLibrary(chainId ?? 1)
    const tokenContract = address && library ? getContract(address, ERC20_ABI, library) : undefined
    Promise.all([tokenContract?.name(), tokenContract?.symbol(), tokenContract?.decimals()])
      .then(r => {
        if (mounted) {
          setCallRes(r)
        }
      })
      .catch(e => {
        console.error(e)
      })
    return () => {
      mounted = false
    }
  }, [chainId, tokenAddress])

  return useMemo(() => {
    const address = isAddress(tokenAddress)
    if (!chainId || !address) return undefined

    if (callRes) {
      const [name, symbol, decimals] = callRes
      return name && symbol && decimals ? new Token(chainId, address, decimals, symbol, name) : undefined
    }
    return undefined
  }, [callRes, chainId, tokenAddress])
}
