import React, { useEffect, useState } from 'react'
import { ETHER } from '@uniswap/sdk'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import AppBody from 'pages/AppBody'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import NumberInputPanel from 'components/NumberInputPanel'
import { useCalculatorCallback } from 'hooks/useCalculatorCallback'
import { tryFormatAmount } from 'state/swap/hooks'
import useTheme from 'hooks/useTheme'
import Card, { OutlineCard } from 'components/Card'
import { Typography, Box } from '@mui/material'
import useMediaWidth from 'hooks/useMediaWidth'

const InputWrapper = styled(RowBetween)`
  & > div {
    width: 46%;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 24px;
    & > div {
      width: 100%;
    }
  `};
`

// export const Divider = styled.div`
//   width: calc(100% + 48px);
//   height: 0;
//   margin-left: -24px;
//   border-bottom: 1px solid ${({ theme }) => theme.bg4};
// `

enum ERROR {
  EMPTY_PRICE = 'Price cannot be 0',
  EMPTY_PRICE_CAP = 'Price ceiling cannot be 0',
  EMPTY_PRICE_FLOOR = 'Price floor cannot be 0',
  EMPTY_TOTAL_CALL = 'Bull issuance cannot be empty',
  EMPTY_TOTAL_PUT = 'Bear issuance cannot be empty',
  LARGER_FLOOR_THAN_CAP = 'Price floor cannot be larger than price ceiling',
  PRICE_EXCEEDS_PRICE_RANGE = 'Price must not be smaller than price floor or larger than price ceiling'
}

const limitDigits = (string: string, currencyDecimal = 6) => {
  const dotIndex = string.indexOf('.')
  return string.slice(0, dotIndex + currencyDecimal)
}

export default function Calculator() {
  const [error, setError] = useState('')
  const [price, setPrice] = useState('')
  const [priceFloor, setPriceFloor] = useState('')
  const [priceCap, setPriceCap] = useState('')
  const [totalCall, setTotalCall] = useState('')
  const [totalPut, setTotalPut] = useState('')
  const [priceCall, setPriceCall] = useState('')
  const [pricePut, setPricePut] = useState('')
  const { callback: calculateCallback } = useCalculatorCallback()
  const theme = useTheme()
  const isDownSm = useMediaWidth('upToSmall')

  useEffect(() => {
    if (!calculateCallback) return

    if (!price || !priceFloor || !priceCap || !totalCall || !totalPut) {
      setError('')
      return
    }

    let error = ''
    if (+price < +priceFloor || +price > +priceCap) error = ERROR.PRICE_EXCEEDS_PRICE_RANGE
    if (+priceFloor > +priceCap) error = ERROR.LARGER_FLOOR_THAN_CAP
    if (!totalPut) error = ERROR.EMPTY_TOTAL_PUT
    if (!totalCall) error = ERROR.EMPTY_TOTAL_CALL
    if (!priceFloor || +priceFloor === 0) error = ERROR.EMPTY_PRICE_FLOOR
    if (!priceCap || +priceCap === 0) error = ERROR.EMPTY_PRICE_CAP
    if (!price || +price === 0) error = ERROR.EMPTY_PRICE
    setError(error)

    if (error) return
    debounce(() => {
      const res = calculateCallback(price, priceFloor, priceCap, totalCall, totalPut)
      res.then(res => {
        if (res === null) return
        res.priceCall && setPriceCall(tryFormatAmount(res.priceCall, ETHER)?.toFixed(6) ?? '')
        res.pricePut && setPricePut(tryFormatAmount(res.pricePut, ETHER)?.toFixed(6) ?? '')
      })
    }, 500)()
  }, [calculateCallback, price, priceCap, priceFloor, totalCall, totalPut])

  return (
    <Box padding={isDownSm ? '32px 20px' : '96px 0px'}>
      <AppBody maxWidth="560px">
        <AutoColumn gap="20px">
          <AutoColumn gap="8px">
            <Typography fontSize={24} fontWeight={700}>
              Option Calculator
            </Typography>
            <TYPE.body fontSize={16} opacity={0.4}>
              The calculator is configured with Antimatter option equation and allows you to estimate bull and bear
              token prices in various options. You can use it as the referral for the potential arbitrage opportunity.
            </TYPE.body>
          </AutoColumn>
          <AutoColumn gap="14px">
            <TYPE.body>Input:</TYPE.body>
            <OutlineCard padding="24px 20px">
              <NumberInputPanel
                label="Underlying Target Currency Market Price"
                onUserInput={price => setPrice(limitDigits(price))}
                value={price}
                showMaxButton={false}
                id="price"
                unit="USDT"
                hideBalance
              />
              <InputWrapper style={{ marginTop: 24 }}>
                <NumberInputPanel
                  label="Price Floor"
                  onUserInput={priceFloor => setPriceFloor(limitDigits(priceFloor))}
                  value={priceFloor}
                  showMaxButton={false}
                  id="pricefloor"
                  unit="USDT"
                  hideBalance
                />
                <NumberInputPanel
                  label="Price Ceiling"
                  onUserInput={priceCap => setPriceCap(limitDigits(priceCap))}
                  value={priceCap}
                  showMaxButton={false}
                  id="priceCeiling"
                  unit="USDT"
                  hideBalance
                />
              </InputWrapper>
              <InputWrapper style={{ marginTop: 24 }}>
                <NumberInputPanel
                  label="Bull Issuance"
                  onUserInput={totalCall => setTotalCall(totalCall)}
                  value={totalCall}
                  showMaxButton={false}
                  id="callIssuance"
                  unit="Shares"
                  hideBalance
                />
                <NumberInputPanel
                  label="Bear Issuance"
                  onUserInput={totalPut => setTotalPut(totalPut)}
                  value={totalPut}
                  showMaxButton={false}
                  id="putIssuance"
                  unit="Shares"
                  hideBalance
                />
              </InputWrapper>
            </OutlineCard>

            <TYPE.body color={theme.red1} fontSize={14} style={{ height: 16 }}>
              {error}
            </TYPE.body>
          </AutoColumn>
          <AutoColumn gap="16px">
            <TYPE.body>Output:</TYPE.body>
            <OutlineCard padding="24px 20px">
              <InputWrapper>
                <AutoColumn gap="4px">
                  <TYPE.body color={theme.text5} fontSize={12}>
                    Price of Bull token
                  </TYPE.body>
                  <Card
                    style={{
                      backgroundColor: theme.mainBG,
                      width: '100%',
                      padding: '1rem',
                      height: '3rem',
                      borderRadius: '14px'
                    }}
                  >
                    <RowBetween style={{ height: '100%' }}>
                      {priceCall ? priceCall : <span style={{ color: theme.text3 }}>0.00</span>}{' '}
                      <span style={{ color: '#000000' }}>USDT</span>
                    </RowBetween>
                  </Card>
                </AutoColumn>
                <AutoColumn gap="4px">
                  <TYPE.body color={theme.text5} fontSize={12}>
                    Price of Bull token
                  </TYPE.body>
                  <Card
                    style={{
                      backgroundColor: theme.mainBG,
                      width: '100%',
                      padding: '1rem',
                      height: '3rem',
                      borderRadius: '14px'
                    }}
                  >
                    <RowBetween style={{ height: '100%' }}>
                      {pricePut ? pricePut : <span style={{ color: theme.text3 }}>0.00</span>}{' '}
                      <span style={{ color: '#000000' }}>USDT</span>
                    </RowBetween>
                  </Card>
                </AutoColumn>
              </InputWrapper>
            </OutlineCard>
          </AutoColumn>
        </AutoColumn>
      </AppBody>
    </Box>
  )
}
