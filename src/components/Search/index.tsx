import React, { useState, useCallback } from 'react'
import { Currency, Token } from '@uniswap/sdk'
import { /* ButtonOutlinedPrimary, */ ButtonPrimary } from 'components/Button'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import NumberInputPanel from 'components/NumberInputPanel'
import { Box } from '@mui/material'
import useMediaWidth from 'hooks/useMediaWidth'

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
  tokenList
}: {
  // onOptionType?: (type: string) => void
  // optionTypeQuery?: string
  onClear?: () => void
  onSearch: (query: any) => void
  tokenList?: Token[]
}) {
  const match = useMediaWidth('upToSmall')
  const [assetTypeQuery, setAssetTypeQuery] = useState<Currency | undefined>(undefined)
  const [optionIdQuery, setOptionIdQuery] = useState('')
  // const [rangeQuery, setRangeQuery] = useState<Range>({
  //   floor: undefined,
  //   cap: undefined
  // })
  const [currencySearchOpen, setCurrencySearchOpen] = useState(false)

  const handleDismissSearch = useCallback(() => setCurrencySearchOpen(false), [])
  // const handleOpenAssetSearch = useCallback(() => setCurrencySearchOpen(true), [])
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

  return (
    <>
      <CurrencySearchModal
        isOpen={currencySearchOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={setAssetTypeQuery}
        tokenList={tokenList ?? []}
      />

      <Box width={match ? '100%' : 'fit-content'} display="flex" flexDirection={match ? 'column' : 'row'} gap="12px">
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

        <Box>
          <ButtonPrimary width={match ? '100%' : '160px'} onClick={handleSearch}>
            <SearchIcon style={{ marginRight: 10 }} />
            Search
          </ButtonPrimary>
        </Box>
      </Box>
    </>
  )
}
