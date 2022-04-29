import { SearchQuery } from 'components/Search'
import { useEffect, useMemo, useState } from 'react'
import { Axios } from '../utils/option/axios'
import { useBlockNumber } from 'state/application/hooks'
import { useNetwork } from './useNetwork'
import { OptionListData } from 'state/market/hooks'
import { toChecksumAddress } from 'web3-utils'
import { isAddress } from 'utils'
import { useTokenOtherChain } from './useTokenOtherChain'
import { tryFormatAmount } from 'state/swap/hooks'
import { Token } from '@uniswap/sdk'

const parseOptionListData = (item: any) => {
  const id = +item.chainId
  const callAddress = isAddress(item.callAddress) ? toChecksumAddress(item.callAddress) : item.callAddress
  const putAddress = isAddress(item.putAddress) ? toChecksumAddress(item.putAddress) : item.putAddress
  const underlying = isAddress(item.underlying) ? toChecksumAddress(item.underlying) : item.underlying
  const currency = isAddress(item.currency) ? toChecksumAddress(item.currency) : item.currency
  const creator = isAddress(item.creator) ? toChecksumAddress(item.creator) : item.currency

  return { ...item, chainId: id, callAddress, putAddress, underlying, currency, creator }
}

export function useOptionList(
  searchParams: SearchQuery,
  chainId: number | undefined
): {
  page: {
    total: number
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  ids: string[] | undefined
  data: OptionListData[] | undefined
  firstLoading: boolean
} {
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [ids, setIds] = useState(undefined)
  const [data, setData] = useState<OptionListData[] | undefined>(undefined)
  const blockNumber = useBlockNumber()
  const [firstLoading, setFirstLoading] = useState(true)

  const {
    httpHandlingFunctions: { errorFunction }
  } = useNetwork()

  useEffect(() => {
    ;(async () => {
      const r: any = await Axios.post(
        'getCreateOptionList',
        {},
        { pageNum: currentPage, ...searchParams, ...(chainId ? { chainId } : {}) }
      ).catch(e => {
        console.error(e)
        errorFunction()
        // throw new Error(e)
      })
      setFirstLoading(false)
      setTotal(+r?.data?.data?.total)
      setTotalPages(r?.data?.data?.pages)
      setIds(r?.data?.data?.list?.map(({ optionIndex }: { optionIndex: string }) => optionIndex))
      setData(r?.data?.data?.list?.map((item: OptionListData) => parseOptionListData(item)))
    })()
  }, [currentPage, searchParams, blockNumber, errorFunction, chainId])

  return {
    ids: ids,
    data,
    firstLoading,
    page: {
      total,
      totalPages,
      currentPage,
      setCurrentPage
    }
  }
}

export function useFormattedOptionListData(option: OptionListData | undefined) {
  const call = useTokenOtherChain(option?.callAddress, option?.chainId)
  const put = useTokenOtherChain(option?.putAddress, option?.chainId)

  return useMemo(() => {
    if (!option) return undefined
    const currency = new Token(1, option.currency, option.currencyDecimals, option.currencySymbol ?? 'TOKEN')
    const underlying = new Token(1, option.underlying, option.underlyingDecimals, option.underlyingSymbol ?? 'TOKEN')
    const range = {
      cap: tryFormatAmount(option?.priceCap, currency),
      floor: tryFormatAmount(option?.priceFloor, currency)
    }
    const totalCall =
      option.totalCall === '0'
        ? '0'
        : call
        ? tryFormatAmount(option.totalCall, call)
            ?.toFixed(2)
            .toString()
        : '-'
    const totalput =
      option.totalPut === '0'
        ? '0'
        : put
        ? tryFormatAmount(option.totalPut, put)
            ?.toFixed(2)
            .toString()
        : '-'
    return {
      call,
      put,
      underlying,
      details: {
        'Option Range': option
          ? `$${range.floor?.toExact().toString() ?? '-'}~$${range.cap?.toExact().toString() ?? '-'}`
          : '',
        'Underlying Assets': option ? `${option.underlyingSymbol}, ${option.currencySymbol}` : '-',
        'Current Bear Issuance': totalput,
        'Current Bull Issuance': totalCall
      }
    }
  }, [call, option, put])
}
