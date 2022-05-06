import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Grid, Box as MuiBox } from '@mui/material'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonPrimary, RoundButton } from 'components/Button'
import { AnimatedImg, AnimatedWrapper, ExternalLink, TYPE } from 'theme'
//import { OptionIcon } from 'components/Icons'
import { AutoColumn } from 'components/Column'
import { Text, Box } from 'rebass'
import Loader from 'assets/svg/antimatter_background_logo.svg'
import { XCircle } from 'react-feather'
import { useNetwork } from 'hooks/useNetwork'
import { useFormattedOptionListData, useOptionList } from 'hooks/useOptionList'
import { useOptionTypeCount } from '../../state/market/hooks'
// import { useActiveWeb3React } from 'hooks'
import Search, { SearchQuery } from 'components/Search'
// import { Axios } from 'utils/option/axios'
// import { formatUnderlying } from 'utils/option/utils'
import Pagination from 'components/Pagination'
import Card from 'components/Card'
// import { usePrice } from 'hooks/usePrice'
import { ButtonOutlined } from 'components/Button'
import { ReactComponent as TableIcon } from 'assets/svg/table_icon.svg'
import { ReactComponent as CardIcon } from 'assets/svg/card_icon.svg'
import Table, { Row } from 'components/Table'
import useMediaWidth from 'hooks/useMediaWidth'
import { OptionListData } from 'state/market/hooks'
import { ChainTabs } from 'components/Tab/ChainTabs'
import { OptionCardSkeleton } from 'components/OptionTradeCard'
import { ListOptionCard } from 'components/OptionTradeCard/ListOptionCard'
import CurrencyLogo from 'components/CurrencyLogo'
import { Symbol } from 'constants/index'
import { SUPPORTED_NETWORKS } from 'constants/chains'

const TableHeaders = [
  'Chain',
  'Option ID',
  'Underlying Asset',
  'Option Range',
  'Current Bear Issuance',
  'Current Bull Issuance'
]

const Circle = styled.div`
  flex-shrink: 0;
  margin-right: 16px;
  border-radius: 50%;
  border: 1px solid #00000010;
  background: #ffffff;
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export interface OptionInterface {
  optionId: string | undefined
  title: string
  address?: string
  addresses?: {
    callAddress: string | undefined
    putAddress: string | undefined
  }
  optionType?: string
  underlyingAddress: string
  underlyingDecimals?: string
  currencyAddress?: string
  currencyDecimals?: string
  type?: Type
  underlyingSymbol: string | undefined
  details: {
    'Option Price Range': string | undefined
    'Underlying Asset': string | undefined
    'Total Current Issuance'?: string | undefined
    'Market Price'?: string | undefined
    'Your Bull Position'?: string | undefined
    'Your Bear Position'?: string | undefined
  }
  range: {
    floor: string | undefined
    cap: string | undefined
  }
}

export enum Type {
  CALL = 'call',
  PUT = 'put'
}

export enum TabOptions {
  BTC,
  ETH
}

export enum Mode {
  CARD,
  TABLE
}

const Wrapper = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxContentWidth};
  margin: 0 auto auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-top:30px;
`};
`

export const StyledExternalLink = styled(ExternalLink)`
  text-decoration: none;
  font-size: 12px;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text4};
  }
`

export default function OptionTrade() {
  // const { chainId } = useActiveWeb3React()
  const optionCount = useOptionTypeCount()
  // const [tokenList, setTokenList] = useState<Token[] | undefined>(undefined)
  const [filteredIndexes, setFilteredIndexes] = useState<string[] | undefined>(undefined)
  const history = useHistory()
  const [searchParams, setSearchParams] = useState<SearchQuery>({})
  const [chainIdQuery, setChainIdQuery] = useState<undefined | number>(undefined)
  const { page, ids: currentIds, firstLoading, data } = useOptionList(searchParams, chainIdQuery)

  const [mode, setMode] = useState(Mode.TABLE)

  const match = useMediaWidth('upToSmall')

  useEffect(() => {
    setFilteredIndexes(currentIds)
  }, [currentIds])

  const {
    // httpHandlingFunctions: { errorFunction },
    NetworkErrorModal
  } = useNetwork()

  const optionTypeIndexes = useMemo(() => {
    const list = Array.from({ length: optionCount }, (v, i) => i.toString())
    return list
  }, [optionCount])

  const handleClearSearch = useCallback(() => {
    setSearchParams({})
  }, [])

  const handleSearch = useCallback((body: SearchQuery) => {
    setSearchParams(body)
  }, [])

  // useEffect(() => {
  //   if (!chainId) return
  //   Axios.get('getUnderlyingList', { chainId })
  //     .then(r => {
  //       setTokenList(formatUnderlying(r.data.data, chainId))
  //     })
  //     .catch(e => {
  //       console.error(e)
  //       errorFunction()
  //     })
  // }, [chainId, errorFunction])

  const rowsComponent = useMemo(() => {
    if (!data) return

    return data.map(option => (
      <OptionRow
        option={option}
        key={option.id + option.chainId}
        onClick={() => {
          // if (!chainId) return
          // if (option.chainId === chainId) {
          history.push(`/option_trading/${option.chainId}/${option.id}`)
          // } else {
          //   switchChainCallback({ id: option.chainId, hex: toHex(option.chainId) }, library, account)
          // }
        }}
      />
    ))
  }, [data, history])

  const handleChainId = useCallback(val => {
    setChainIdQuery(val)
  }, [])

  return (
    <>
      <NetworkErrorModal />

      <Wrapper id="optionTrade">
        <ChainTabs chainIdQuery={chainIdQuery} setChainIdQuery={handleChainId} />
        <Card margin="24px 0 auto" padding="40px 25px">
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Search
              // optionTypeQuery={optionTypeQuery}
              // onOptionType={handleSelectOptionType}
              onClear={handleClearSearch}
              onSearch={handleSearch}
              chainIdQuery={chainIdQuery}
              // tokenList={tokenList}
              chainId={chainIdQuery}
            />
            {!match && <ModeSwitch current={mode} setMode={setMode} />}
          </Box>

          {filteredIndexes && (
            <>
              <Grid container mt={'20px'} spacing={20}>
                {(mode === Mode.CARD || match) &&
                  data &&
                  data.map((option, idx) => (
                    <Grid key={idx} item xs={12} md={4}>
                      {option ? (
                        <ListOptionCard
                          option={option}
                          key={option.id + option.chainId}
                          buttons={
                            <ButtonPrimary
                              onClick={() => history.push(`/option_trading/${option.chainId}/${option.id}`)}
                            >
                              Trade
                            </ButtonPrimary>
                          }
                        />
                      ) : (
                        <OptionCardSkeleton key={idx} />
                      )}
                    </Grid>
                  ))}
              </Grid>
              {mode === Mode.TABLE && <Table header={TableHeaders} rowsComponent={rowsComponent} />}
            </>
          )}
          {page.totalPages !== 0 && (
            <Pagination
              page={page.currentPage}
              count={page.totalPages}
              perPage={8}
              onChange={(event, value) => page.setCurrentPage(value)}
              total={page.total}
            />
          )}
          <AlternativeDisplay
            loading={firstLoading}
            optionIndexes={optionTypeIndexes}
            filteredIndexes={filteredIndexes}
          />
        </Card>
      </Wrapper>
    </>
  )
}

export function AlternativeDisplay({
  optionIndexes,
  filteredIndexes,
  loading
}: {
  optionIndexes: string[] | undefined
  filteredIndexes: string[] | undefined
  loading: boolean
}) {
  return (
    <AutoColumn justify="center" style={{ marginTop: 100 }}>
      {loading ? (
        <AnimatedWrapper>
          <AnimatedImg>
            <img src={Loader} alt="loading-icon" />
          </AnimatedImg>
        </AnimatedWrapper>
      ) : (
        optionIndexes &&
        optionIndexes.length > 0 &&
        filteredIndexes &&
        filteredIndexes.length === 0 && (
          <AutoColumn justify="center" gap="20px">
            <XCircle size={40} strokeWidth={1} />
            <TYPE.body>No results found</TYPE.body>
            <TYPE.body marginBottom={60}>Please change your search query and try again</TYPE.body>
          </AutoColumn>
        )
      )}
    </AutoColumn>
  )
}

export function ModeSwitch({ current, setMode }: { current: number; setMode: (mode: number) => void }) {
  return (
    <Box display="flex" style={{ gap: '12px' }}>
      {[<CardIcon key="card" />, <TableIcon key="table" />].map((icon, idx) => {
        return (
          <ButtonOutlined
            key={idx}
            style={{ width: 60, border: '1px solid rgba(0, 0, 0, 0.1)' }}
            onClick={() => setMode(idx)}
          >
            <Box opacity={current === idx ? 1 : 0.4} height="24px" width="24-x">
              {icon}
            </Box>
          </ButtonOutlined>
        )
      })}
    </Box>
  )
}

export function OptionRow({ option, onClick }: { option: OptionListData; onClick: () => void }) {
  const data = useFormattedOptionListData(option)

  return (
    <Row
      row={[
        <>
          {option ? (
            <MuiBox display="flex" gap={5} alignItems="center">
              <Circle>
                <CurrencyLogo currencySymbol={Symbol[+option.chainId as keyof typeof Symbol]} />
              </Circle>
              <Text fontSize={12} color="#252525">
                {SUPPORTED_NETWORKS[+option.chainId as keyof typeof SUPPORTED_NETWORKS]?.chainName}
              </Text>
            </MuiBox>
          ) : null}
        </>,
        <>{option.optionIndex}</>,
        <>{data?.details['Underlying Assets'] ?? null}</>,
        <>{data?.details['Option Range'] ?? null}</>,
        <>{data?.details['Current Bear Issuance'] ?? null}</>,
        <>{data?.details['Current Bull Issuance'] ?? null}</>,
        <RoundButton key={option.id} onClick={onClick}>
          Trade
        </RoundButton>
      ]}
    />
  )
}
