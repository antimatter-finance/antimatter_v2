import React from 'react'
import styled from 'styled-components'
import OptionSwap from './OptionSwap'
import AppBody, { BodyWrapper } from 'pages/AppBody'
import { CustomLightSpinner, ExternalLink, TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import Loader from 'assets/svg/gray_loader.svg'
import { Option, OptionPrice, useOption, useOptionPrice } from '../../state/market/hooks'
import { tryFormatAmount } from '../../state/swap/hooks'
import { getEtherscanLink, shortenAddress } from 'utils'
import { useActiveWeb3React } from 'hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { NavLink } from 'react-router-dom'
import { Typography } from '@mui/material'
import { ReactComponent as ArrowLeft } from 'assets/svg/arrow_left.svg'
import useTheme from 'hooks/useTheme'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0px 20px;
  width: calc(100% + 2px);
  margin: 0 -1px
  `}
`

export const StyledExternalLink = styled(ExternalLink)`
  text-decoration: none;
  font-size: 12px;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text4};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-right:14px
  `}
`

const InfoAppBody = styled(BodyWrapper)`
  max-width: 1116px;

  min-height: 402px;
  margin: -1px;
  border-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 48px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    padding:20px;
  `}
`

const InfoAppBodyInner = styled(BodyWrapper)`
  min-width: 550px;
  width: 50%;
  background: transparent
    ${({ theme }) => theme.mediaWidth.upToMedium`
  min-width: unset;
  width: 100%;

  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  border: none;
  background: transparent;
  `};
`

export default function OptionTradeAction({ optionId }: { optionId?: string }) {
  //const { chainId } = useActiveWeb3React()
  // const [tab, setTab] = useState(TABS.SWAP)
  const option = useOption(optionId)
  const theme = useTheme()
  // const history = useHistory()
  //const currencyA = chainId === ChainId.MAINNET ? USDT : chainId && WETH[chainId]
  //const currencyB = useCurrency(addressA)
  //const underlyingCurrency = useCurrency(option?.underlyingAddress ?? undefined)
  //const { pair } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  // const handleSetTab = useCallback((tab: TABS) => setTab(tab), [setTab])
  // const handleBack = useCallback(() => history.push('/option_trading'), [history])

  const optionPrice = useOptionPrice(option)

  return (
    <>
      {optionId ? (
        <Wrapper>
          <RowBetween style={{ padding: '27px 0', maxWidth: theme.maxContentWidth }}>
            <NavLink to={'/option_trading'} style={{ textDecoration: 'none', padding: '0 20px' }}>
              <ArrowLeft />
              <Typography component="span" color="#000000" fontSize={{ xs: 12, md: 14 }} ml={'16px'}>
                Go Back
              </Typography>
            </NavLink>
          </RowBetween>
          <OptionSwap optionPrice={optionPrice} option={option} optionId={optionId} />
        </Wrapper>
      ) : (
        <AppBody style={{ minHeight: '402px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CustomLightSpinner src={Loader} alt="loader" size={'100px'} />
        </AppBody>
      )}
    </>
  )
}

export function Info({
  option,
  placeholder = '-',
  optionPrice
}: {
  option?: Option
  placeholder?: string
  optionPrice: OptionPrice | undefined
}) {
  const { chainId } = useActiveWeb3React()
  const callTotal = useTotalSupply(option?.call?.token)
  const putTotal = useTotalSupply(option?.put?.token)
  const undTotal = useCurrencyBalance(option?.call?.token.address, option?.underlying ?? undefined)
  const curTotal = useCurrencyBalance(option?.put?.token.address, option?.currency ?? undefined)

  const priceCall = optionPrice?.priceCall
  const pricePut = optionPrice?.pricePut
  return (
    <InfoAppBody>
      <TYPE.smallHeader style={{ marginBottom: 20 }} fontSize={18}>
        Option Information
      </TYPE.smallHeader>
      <InfoAppBodyInner>
        <AutoColumn style={{ width: '100%' }} justify="center" gap="32px">
          <AutoColumn style={{ width: '100%' }} justify="center" gap="md">
            <RowBetween>
              <TYPE.darkGray>{'Option Price Range:'}</TYPE.darkGray>
              <TYPE.main>
                {option &&
                  `$${tryFormatAmount(option?.priceFloor, option?.currency ?? undefined)
                    ?.toExact()
                    .toString() ?? placeholder} ~ $${tryFormatAmount(option?.priceCap, option?.currency ?? undefined)
                    ?.toExact()
                    .toString() ?? placeholder}`}
              </TYPE.main>
            </RowBetween>
            <RowBetween>
              <TYPE.darkGray>{'Underlying Assets:'}</TYPE.darkGray>
              <TYPE.main>
                {(option && option?.underlying?.symbol) ?? placeholder}, {option && option?.currency?.symbol}
              </TYPE.main>
            </RowBetween>
            <RowBetween>
              <TYPE.darkGray>{'Underlying Asset Ratio:'}</TYPE.darkGray>
              <TYPE.main>
                {undTotal ? undTotal.toFixed(2).toString() + option?.underlying?.symbol : '-'} :{' '}
                {curTotal ? curTotal.toFixed(2).toString() + option?.currency?.symbol : '-'}
              </TYPE.main>
            </RowBetween>
          </AutoColumn>
          <AutoColumn style={{ width: '100%' }} justify="center" gap="md">
            <RowBetween>
              <TYPE.darkGray>{'Bull Token Contract Address:'}</TYPE.darkGray>
              <ExternalLink
                href={option?.call && chainId ? getEtherscanLink(chainId, option?.call?.token.address, 'token') : ''}
              >
                <TYPE.main>
                  {option && option?.call?.token.address ? shortenAddress(option.call?.token.address) : placeholder}
                </TYPE.main>
              </ExternalLink>
            </RowBetween>
            <RowBetween>
              <TYPE.darkGray>{'Bull Token Issuance:'}</TYPE.darkGray>
              <TYPE.main>{callTotal?.toFixed(2).toString() ?? placeholder}</TYPE.main>
            </RowBetween>
            <RowBetween>
              <TYPE.darkGray>{'Bull Token Market Price:'}</TYPE.darkGray>
              <TYPE.main>{`$${priceCall ? priceCall.toSignificant(6) : placeholder}`}</TYPE.main>
            </RowBetween>
          </AutoColumn>
          <AutoColumn style={{ width: '100%' }} justify="center" gap="md">
            <RowBetween>
              <TYPE.darkGray>{'Bear Token Contract Address:'}</TYPE.darkGray>
              <ExternalLink
                href={option?.put && chainId ? getEtherscanLink(chainId, option?.put?.token.address, 'token') : ''}
              >
                <TYPE.main>
                  {option && option?.put?.token.address ? shortenAddress(option.put.token.address) : placeholder}
                </TYPE.main>
              </ExternalLink>
            </RowBetween>
            <RowBetween>
              <TYPE.darkGray>{'Bear Token Issuance:'}</TYPE.darkGray>
              <TYPE.main>{putTotal?.toFixed(2).toString() ?? placeholder}</TYPE.main>
            </RowBetween>
            <RowBetween>
              <TYPE.darkGray>{'Bear Token Market Price:'}</TYPE.darkGray>
              <TYPE.main>{`$${pricePut ? pricePut.toSignificant(6) : placeholder}`}</TYPE.main>
            </RowBetween>
          </AutoColumn>
        </AutoColumn>
      </InfoAppBodyInner>
    </InfoAppBody>
  )
}
