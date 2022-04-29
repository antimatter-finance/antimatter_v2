import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'

const MainNetwork = new NetworkConnector({
  urls: { 1: 'https://mainnet.infura.io/v3/d49aedc5c8d04128ab366779756cfacd' }
})
const RopstenNetwork = new NetworkConnector({
  urls: { 3: 'https://ropsten.infura.io/v3/ab440a3a67f74b6b8a0a8e8e13a76a52' }
})
const BscNetwork = new NetworkConnector({
  urls: {
    56: 'https://bsc-dataseed.binance.org/'
  }
})
const AvaxNetwork = new NetworkConnector({
  urls: {
    43114: 'https://api.avax.network/ext/bc/C/rpc'
  }
})
const RinkebyNetwork = new NetworkConnector({
  urls: { 4: 'https://rinkeby.infura.io/v3/ab440a3a67f74b6b8a0a8e8e13a76a52' }
})
const KovanNetwork = new NetworkConnector({
  urls: { 42: 'https://kovan.infura.io/v3/ab440a3a67f74b6b8a0a8e8e13a76a52' }
})

const MaticNetwork = new NetworkConnector({
  urls: { 137: 'https://polygon-rpc.com/' }
})

const ArbitrumNetwork = new NetworkConnector({
  urls: { 42161: 'https://arb1.arbitrum.io/rpc' }
})

export function getOtherNetworkLibrary(chainId: number) {
  switch (chainId) {
    case 1:
      return new Web3Provider(MainNetwork.provider as any)
    case 3:
      return new Web3Provider(RopstenNetwork.provider as any)
    case 56:
      return new Web3Provider(BscNetwork.provider as any)
    case 43114:
      return new Web3Provider(AvaxNetwork.provider as any)
    case 4:
      return new Web3Provider(RinkebyNetwork.provider as any)
    case 42:
      return new Web3Provider(KovanNetwork.provider as any)
    case 137:
      return new Web3Provider(MaticNetwork.provider as any)
    case 42161:
      return new Web3Provider(ArbitrumNetwork.provider as any)
    default:
      return undefined
  }
}
