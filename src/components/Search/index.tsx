import React, { useState, useCallback, useEffect } from 'react'
import { Currency } from '@uniswap/sdk'
import { ButtonOutlinedPrimary, ButtonPrimary } from 'components/Button'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import NumberInputPanel from 'components/NumberInputPanel'
import { Box } from '@mui/material'
import useMediaWidth from 'hooks/useMediaWidth'
import ButtonSelect from 'components/Button/ButtonSelect'
import CurrencyLogo from 'components/CurrencyLogo'
import { currencyNameHelper } from 'utils/marketStrategyUtils'

export interface SearchQuery {
  optionIndex?: number | string
  id?: number | string
  priceCap?: number | string
  priceFloor?: number | string
  underlyingSymbol?: string
}

const ALL = {
  id: 'ALL',
  title: 'All'
}

export default function Search({
  // onOptionType,
  // optionTypeQuery,
  onClear,
  onSearch,
  // tokenList,
  chainId,
  chainIdQuery
}: {
  // onOptionType?: (type: string) => void
  // optionTypeQuery?: string
  onClear?: () => void
  onSearch: (query: any) => void
  chainIdQuery?: number
  // tokenList?: Token[]
  chainId?: number | undefined
}) {
  const match = useMediaWidth('upToMedium')
  const [assetTypeQuery, setAssetTypeQuery] = useState<Currency | undefined>(undefined)
  const [optionIdQuery, setOptionIdQuery] = useState('')
  // const { chainId } = useActiveWeb3React()

  // const [rangeQuery, setRangeQuery] = useState<Range>({
  //   floor: undefined,
  //   cap: undefined
  // })
  const [currencySearchOpen, setCurrencySearchOpen] = useState(false)

  const handleDismissSearch = useCallback(() => setCurrencySearchOpen(false), [])
  const handleOpenAssetSearch = useCallback(() => setCurrencySearchOpen(true), [])
  const handleSearch = useCallback(() => {
    const body = {} as SearchQuery
    if (optionIdQuery) {
      body.optionIndex = +optionIdQuery
    }

    if (assetTypeQuery) {
      if (assetTypeQuery.symbol === ALL.id) {
        delete body.underlyingSymbol
      } else {
        body.underlyingSymbol = assetTypeQuery.symbol
      }
    }

    onSearch(body)
  }, [assetTypeQuery, onSearch, optionIdQuery])

  const handleClear = useCallback(() => {
    onClear && onClear()
    setAssetTypeQuery(undefined)
    setOptionIdQuery('')
  }, [onClear])

  useEffect(() => {
    handleClear()
  }, [chainIdQuery, handleClear])

  return (
    <>
      <CurrencySearchModal
        isOpen={currencySearchOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={setAssetTypeQuery}
        showEther={false}
        // tokenList={tokenList ?? []}
      />

      <Box width={{ xs: '100%', md: '100%' }} display="flex" flexDirection={match ? 'column' : 'row'} gap={12}>
        <ButtonSelect
          onClick={handleOpenAssetSearch}
          width={match ? '100%' : '256px'}
          selectedId={assetTypeQuery && assetTypeQuery.symbol !== ALL.id ? assetTypeQuery.symbol : undefined}
        >
          {assetTypeQuery && assetTypeQuery.symbol !== ALL.id && (
            <CurrencyLogo currency={assetTypeQuery} size={'24px'} style={{ marginRight: 8 }} />
          )}
          {currencyNameHelper(assetTypeQuery, 'Select asset type', chainId)}
        </ButtonSelect>
        <Box width={match ? '100%' : '256px'}>
          <NumberInputPanel
            // label="Option ID"
            value={optionIdQuery}
            onUserInput={setOptionIdQuery}
            showMaxButton={false}
            id="cap"
            hideBalance={true}
            intOnly={true}
            placeholder={'Enter option ID'}
          />
        </Box>

        <ButtonPrimary width={match ? '100%' : '160px'} onClick={handleSearch}>
          <SearchIcon style={{ marginRight: 10 }} />
          Search
        </ButtonPrimary>
        <ButtonOutlinedPrimary width={match ? '100%' : '160px'} onClick={handleClear}>
          Show All
        </ButtonOutlinedPrimary>
      </Box>
    </>
  )
}
