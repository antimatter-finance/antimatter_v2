import React from 'react'
import { CurrencyAmount, ETHER } from '@uniswap/sdk'
import { Text } from 'rebass'
import { Symbol } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import useTheme from 'hooks/useTheme'

interface TradePriceProps {
  currencyAmount?: CurrencyAmount
}

export default function TradePrice({ currencyAmount }: TradePriceProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.primary1}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        whiteSpace: 'normal',
        textAlign: 'right',
        wordBreak: 'break-all'
      }}
    >
      {currencyAmount ? (
        <>
          ~ {currencyAmount.toExact().toString() ?? '-'}{' '}
          {currencyAmount.currency === ETHER ? Symbol[chainId ?? 1] : currencyAmount.currency.symbol}
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
