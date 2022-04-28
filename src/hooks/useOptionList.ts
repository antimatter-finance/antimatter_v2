import { SearchQuery } from 'components/Search'
import { useEffect, useState } from 'react'
import { Axios } from '../utils/option/axios'
import { useBlockNumber } from 'state/application/hooks'
import { useNetwork } from './useNetwork'
import { OptionListData } from 'state/market/hooks'
import { toChecksumAddress } from 'web3-utils'
import { isAddress } from 'utils'

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
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
  }
  ids: string[] | undefined
  data: OptionListData[] | undefined
  firstLoading: boolean
} {
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
      totalPages,
      currentPage,
      setCurrentPage
    }
  }
}
