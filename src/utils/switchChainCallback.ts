import { SUPPORTED_NETWORKS } from 'constants/chains'

export const switchChainCallback = (
  toChain: { id: number; hex: string },
  library: any,
  account: any,
  callback?: () => void
) => {
  if (!toChain?.id || !library) return
  if ([1, 3, 4, 5, 42].includes(toChain.id)) {
    library?.send('wallet_switchEthereumChain', [{ chainId: toChain?.hex }, account]).then(() => {
      callback && callback()
    })
  } else {
    const params = SUPPORTED_NETWORKS[toChain?.id as keyof typeof SUPPORTED_NETWORKS]
    library?.send('wallet_addEthereumChain', [params, account]).then(() => {
      callback && callback()
    })
  }
}
