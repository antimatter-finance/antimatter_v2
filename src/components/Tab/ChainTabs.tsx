import React, { useMemo } from 'react'
import useMediaWidth from 'hooks/useMediaWidth'
import { CHAIN_ID_LIST, SUPPORTED_NETWORKS, SUPPORTED_NETWORKS_KEYS } from 'constants/chains'
import Box from '@mui/material/Box'
import styled from 'styled-components'
import CurrencyLogo from 'components/CurrencyLogo'
import { Text } from 'rebass'
import Tabs from './Tabs'

const Circle = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
  border-radius: 50%;
  border: 1px solid #00000010;
  background: #ffffff;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export function ChainTabs({
  chainIdQuery,
  setChainIdQuery
}: {
  chainIdQuery: number | undefined
  setChainIdQuery: (val: number | undefined) => void
}) {
  const match = useMediaWidth('upToSmall')
  const data = useMemo(() => {
    const filler = [<></>]
    const list = CHAIN_ID_LIST.map(chainId => {
      filler.push(<></>)
      const network = SUPPORTED_NETWORKS[chainId as SUPPORTED_NETWORKS_KEYS]

      return (
        <Box display="flex" alignItems="center" key={chainId} pb={10}>
          <Circle>
            <CurrencyLogo currencySymbol={network?.nativeCurrency.symbol} size={'70%'} />
          </Circle>
          <Text fontSize={match ? 14 : 20} color={'#000000'} fontWeight={400}>
            {network?.chainName ?? '-'}
          </Text>
        </Box>
      )
    })
    return {
      titles: [
        <Box display="flex" alignItems="center" key="all" pb={10}>
          <Text fontSize={match ? 14 : 20} color={'#000000'} fontWeight={400}>
            All
          </Text>
        </Box>,
        ...list
      ],
      filler: filler
    }
  }, [match])

  return (
    <Tabs
      customCurrentTab={CHAIN_ID_LIST.findIndex((id: number) => id === chainIdQuery) + 1}
      customOnChange={val => {
        if (val === 0) {
          setChainIdQuery(undefined)
          return
        }
        setChainIdQuery(CHAIN_ID_LIST[val - 1])
      }}
      titles={data.titles}
      contents={data.filler}
      tabMarginRight={10}
    />
  )
}
