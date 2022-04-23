import React, { useCallback } from 'react'
// import { useTranslation } from 'react-i18next'
import { Currency } from '@uniswap/sdk'
import styled from 'styled-components'
import { darken } from 'polished'
import CallPutToken from '../CurrencyLogo/CallPutToken'
import { AutoRow, RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'
import useTheme from '../../hooks/useTheme'
import { LabeledCard } from 'components/Card'
import useMediaWidth from 'hooks/useMediaWidth'

const InputRow = styled.div<{ inputOnly: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  width: 50%;
  background-color: ${({ theme }) => theme.mainBG};
  border-radius: 16px;
  height: 60px;
  padding: 0 16px;
`

// const CurrencySelect = styled.div<{ selected: boolean }>`
//   align-items: center;
//   width: 48%;
//   height: 3rem;
//   line-height: 48px;
//   font-weight: 500;
//   background-color: transparent;
//   color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text3)};
//   border-radius: 14px;
//   box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
//   outline: none;
//   user-select: none;
//   border: none;
//   padding: 0 10px;
//   border: 1px solid transparent;
// `

const CustomNumericalInput = styled(NumericalInput)`
  background: ${({ theme }) => theme.mainBG};
  font-size: 16px;
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
  margin-bottom: 4px;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const RowWrapper = styled(Aligner)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  gap: 20px;
  & >div:first-child{
    margin-right: 0
  };
  &>div{
    width: 100%
  }
`}
`

const InputPanel = styled.div<{ hideInput?: boolean; negativeMarginTop?: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  z-index: 1;
  ${({ negativeMarginTop }) => `${negativeMarginTop ? 'margin-top: ' + negativeMarginTop : ''}`}
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  16px;
`

const StyledBalanceMax = styled.button`
  height: 32px;
  background-color: rgba(17, 191, 45, 0.16);
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 16px;
  padding: 0 1rem;
  font-weight: 400;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  label: string
  currency?: Currency | null
  negativeMarginTop?: string
  currencyBalance?: string
  inputOnly?: boolean
  isCall: boolean
}

export default function RedeemTokenPanel({
  value,
  onUserInput,
  label,
  currency,
  negativeMarginTop,
  currencyBalance,
  inputOnly,
  isCall
}: CurrencyInputPanelProps) {
  // const { t } = useTranslation()

  const { account } = useActiveWeb3React()
  const isUpToSmall = useMediaWidth('upToSmall')
  const theme = useTheme()
  const handleOnMax = useCallback(() => onUserInput(currencyBalance ?? ''), [currencyBalance, onUserInput])
  return (
    <InputPanel negativeMarginTop={negativeMarginTop}>
      <div>
        <LabelRow>
          <AutoRow justify="space-between">
            <TYPE.body color={theme.text3} fontWeight={400} fontSize={12} opacity={0.4}>
              {isCall ? 'Bull token' : 'Bear token'}
            </TYPE.body>
            {account && (
              <TYPE.body
                onClick={handleOnMax}
                color={theme.text5}
                fontWeight={400}
                fontSize={12}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {!currencyBalance && ' -'}
                {!inputOnly && !!currency && currencyBalance && 'Balance: ' + currencyBalance}
                {inputOnly &&
                  currencyBalance &&
                  (isCall
                    ? `Bull Token Balance: ${currencyBalance} BULL`
                    : `Bear Token Balance: ${currencyBalance} BEAR`)}
              </TYPE.body>
            )}
          </AutoRow>
        </LabelRow>

        <RowWrapper>
          {!inputOnly && (
            <LabeledCard
              style={{ width: isUpToSmall ? '100%' : '50%', marginRight: isUpToSmall ? 0 : 15 }}
              content={
                <RowFixed>
                  {currency ? <CallPutToken currency={currency} isCall={isCall} /> : null}
                  <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                    {/* {(currency && currency.symbol && label) || t('selectToken')} */}
                    {(currency && currency.symbol && label) || ''}
                  </StyledTokenName>
                </RowFixed>
              }
            />
            // <CurrencySelect selected={!!currency} className="open-currency-select-button">
            //   <Aligner>
            //     <Aligner>
            //       {currency ? <CallPutToken currency={currency} isCall={isCall} /> : null}
            //       <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
            //         {/* {(currency && currency.symbol && label) || t('selectToken')} */}
            //         {(currency && currency.symbol && label) || ''}
            //       </StyledTokenName>
            //     </Aligner>
            //   </Aligner>
            // </CurrencySelect>
          )}
          <InputRow inputOnly={!!inputOnly}>
            <CustomNumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={val => {
                onUserInput(val)
              }}
            />
            {account && currency && <StyledBalanceMax onClick={handleOnMax}>Max</StyledBalanceMax>}
          </InputRow>
        </RowWrapper>
      </div>
    </InputPanel>
  )
}
