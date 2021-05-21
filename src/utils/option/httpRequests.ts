import { ChainId, Token } from '@uniswap/sdk'
import { ZERO_ADDRESS } from 'constants/index'
import { OptionInterface } from 'pages/OptionTrade'
import { OptionTypeData } from 'state/market/hooks'
import { formatCallOption, formatPutOption, formatAndSplitOption, formatOptionType } from './utils'

export interface Underlying {
  underlying: string
  underlyingDecimals: string
  underlyingSymbol: string
}

export interface SearchQuery {
  id?: number | string
  priceCap?: number | string
  priceFloor?: number | string
  underlying?: string
}

export interface HttpHandlingFunctions {
  errorFunction: () => void
  pendingFunction: () => void
  pendingCompleteFunction: () => void
}

const domain = 'https://testapi.antimatter.finance'
const headers = { 'content-type': 'application/json', accept: 'application/json' }

export function getUnderlyingList(
  setList: (list: Token[] | undefined) => void,
  chainId: ChainId | undefined,
  errorFunction: () => void
) {
  const request = new Request(domain + '/app/getUnderlyingList', {
    method: 'GET',
    headers
  })

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        errorFunction()
        throw new Error('server Error')
      }
    })
    .then(response => {
      if (response.data.underlyingList && chainId) {
        const set = new Set()
        const All = new Token(chainId, ZERO_ADDRESS, 18, 'All')
        const list = response.data.underlyingList.reduce(
          (acc: Token[], { underlying, underlyingDecimals, underlyingSymbol }: Underlying) => {
            if (set.has(underlying)) return acc
            set.add(underlying)
            acc.push(
              new Token(chainId, underlying, underlyingDecimals ? parseInt(underlyingDecimals) : 18, underlyingSymbol)
            )
            return acc
          },
          [All]
        )
        response.data && setList(list)
      }
    })
    .catch(error => {
      errorFunction()
      console.error(error)
    })
}

export function getPutOptionList(
  { errorFunction, pendingFunction, pendingCompleteFunction }: HttpHandlingFunctions,
  setList: (list: OptionInterface[]) => void,
  chainId: ChainId | undefined,
  query = ''
) {
  if (!chainId) return
  const request = new Request(`${domain}/app/getPutCreateOptionList?chainId=${chainId}${query ? '&' + query : ''}`, {
    method: 'POST',
    body: '',
    headers
  })
  pendingFunction()
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        errorFunction()
        pendingCompleteFunction()
        throw new Error('server error')
      }
    })
    .then(response => {
      const list = formatPutOption(response.data)
      setList(list)
      pendingCompleteFunction()
    })
    .catch(error => {
      errorFunction()
      pendingCompleteFunction()
      console.error(error)
    })
}

export function getCallOptionList(
  { errorFunction, pendingFunction, pendingCompleteFunction }: HttpHandlingFunctions,
  setList: (list: OptionInterface[]) => void,
  chainId: ChainId | undefined,
  query = ''
) {
  if (!chainId) return
  const request = new Request(`${domain}/app/getCallCreateOptionList?chainId=${chainId}${query ? '&' + query : ''}`, {
    method: 'POST',
    body: '',
    headers
  })
  pendingFunction()
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        pendingCompleteFunction()
        errorFunction()
        throw new Error('server error')
      }
    })
    .then(response => {
      console.debug(response)
      const list = formatCallOption(response.data)
      setList(list)
      pendingCompleteFunction()
    })
    .catch(error => {
      pendingCompleteFunction()
      errorFunction()
      console.error(error)
    })
}

export function getSingleOtionList(
  { errorFunction, pendingFunction, pendingCompleteFunction }: HttpHandlingFunctions,
  setList: (list: OptionInterface[]) => void,
  chainId: ChainId | undefined,
  query = ''
) {
  if (!chainId) return
  const request = new Request(`${domain}/app/getCreateOptionList?chainId=${chainId}${query ? '&' + query : ''}`, {
    method: 'POST',
    body: '',
    headers
  })
  pendingFunction()

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        pendingCompleteFunction()
        errorFunction()
        throw new Error('server error')
      }
    })
    .then(response => {
      const list = formatAndSplitOption(response.data.list)
      setList(list)
      pendingCompleteFunction()
    })
    .catch(error => {
      pendingCompleteFunction()
      errorFunction()
      console.error(error)
    })
}

export function getOptionTypeList(
  { errorFunction, pendingFunction, pendingCompleteFunction }: HttpHandlingFunctions,
  setList: (list: OptionInterface[]) => void,
  chainId: ChainId | undefined,
  query = ''
) {
  if (!chainId) return
  const request = new Request(`${domain}/app/getCreateOptionList?chainId=${chainId}${query ? '&' + query : ''}`, {
    method: 'POST',
    body: '',
    headers
  })

  pendingFunction()

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        pendingCompleteFunction()
        errorFunction()
        throw new Error('server error')
      }
    })
    .then(response => {
      const list = formatOptionType(response.data.list)
      setList(list)
      pendingCompleteFunction()
    })
    .catch(error => {
      pendingCompleteFunction()
      errorFunction()
      console.error(error)
    })
}

export function getSingleOptionType(
  { errorFunction, pendingFunction, pendingCompleteFunction }: HttpHandlingFunctions,
  setData: (list: OptionTypeData) => void,
  chainId: ChainId | undefined,
  id: string | undefined
) {
  if (!chainId) return
  const request = new Request(`${domain}/app/getCreateOptionList?chainId=${chainId ?? ''}&id=${id ?? ''}`, {
    method: 'POST',
    body: '',
    headers
  })
  pendingFunction()

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        pendingCompleteFunction()
        errorFunction()
        throw new Error('server error')
      }
    })
    .then(response => {
      response.data.list?.[0] && setData(response.data.list[0])
      pendingCompleteFunction()
    })
    .catch(error => {
      pendingCompleteFunction()
      errorFunction()
      console.error(error)
    })
}
