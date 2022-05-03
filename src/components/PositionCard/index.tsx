import { JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { darken } from 'polished'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonEmpty, ButtonOutlinedPrimary, ButtonPrimary } from '../Button'
// import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'

// import { useColor } from '../../hooks/useColor'

import Card, { /* GreyCard,*/ LightCard } from '../Card'
import DataCard from '../Card/DataCard'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import useTheme from 'hooks/useTheme'
import { useOption } from '../../state/market/hooks'
import { Link } from 'react-router-dom'
import { Box } from '@mui/material'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(Card)`
  position: relative;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
  `}
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  // const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <>
          <DataCard
            cardTitle="Your position"
            data={[
              {
                title: (
                  <RowFixed>
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                    {currency0.symbol}/{currency1.symbol}
                  </RowFixed>
                ),
                content: userPoolBalance ? userPoolBalance.toSignificant(4) : '-'
              },
              {
                title: 'Your pool share:',
                content: poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'
              },
              {
                title: currency0.symbol + ':',
                content: token0Deposited ? token1Deposited?.toSignificant(6) : '-'
              },
              {
                title: currency1.symbol + ':',
                content: token1Deposited ? token1Deposited.toSignificant(6) : '-'
              }
            ]}
          />
          {/* <GreyCard border={border}>
            <AutoColumn gap="12px">
              <FixedHeightRow>
                <RowFixed>
                  <Text fontWeight={500} fontSize={16}>
                    Your position
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                  <Text fontWeight={500} fontSize={20}>
                    {currency0.symbol}/{currency1.symbol}
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Text fontWeight={500} fontSize={20}>
                    {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    Your pool share:
                  </Text>
                  <Text fontSize={16} fontWeight={500}>
                    {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                  </Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    {currency0.symbol}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                        {token0Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    {currency1.symbol}:
                  </Text>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                        {token1Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </GreyCard> */}
        </>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the pool.
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ index }: { index: string }) {
  const { account } = useActiveWeb3React()
  const option = useOption(index)
  const userCallBalance = useTokenBalance(account ?? undefined, option?.call?.token ?? undefined)
  const userPutBalance = useTokenBalance(account ?? undefined, option?.putToken ?? undefined)

  const [showMore, setShowMore] = useState(false)

  const theme = useTheme()

  return (
    <StyledPositionCard>
      <CardNoise />
      <AutoColumn>
        <Box
          height={60}
          bgcolor={theme.mainBG}
          justifyContent="space-between"
          borderRadius="16px"
          sx={{
            display: 'flex',
            height: {
              xs: 97,
              md: 60
            },
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            padding: {
              xs: '20px 20px 8px',
              md: '0 22px'
            }
          }}
        >
          <AutoRow gap="8px">
            <CurrencyLogo currency={option?.underlying ?? undefined} size={'20px'} />
            <Text fontWeight={400} fontSize={16}>
              {!option || !option.currency || !option.priceCap || !option.priceFloor ? (
                <Dots>Loading</Dots>
              ) : (
                `${option.underlying?.symbol} ($${new TokenAmount(
                  option.currency,
                  option.priceFloor
                ).toSignificant()}~$${new TokenAmount(option.currency, option.priceCap).toSignificant()})`
              )}
            </Text>
          </AutoRow>
          <RowFixed gap="8px" style={{ marginLeft: 'auto' }}>
            <ButtonEmpty
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  Manage
                  <ChevronUp size="30" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  Manage
                  <ChevronDown size="30" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </Box>

        {showMore && (
          <Box padding="24px 20px 32px">
            <AutoColumn gap="8px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={400} color={theme.text5}>
                  Bull token:
                </Text>
                <Text fontSize={16} fontWeight={400}>
                  {userCallBalance ? userCallBalance.toSignificant(4) : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={400} color={theme.text5}>
                  Bear token:
                </Text>
                <Text fontSize={16} fontWeight={400}>
                  {userPutBalance ? userPutBalance.toSignificant(4) : '-'}
                </Text>
              </FixedHeightRow>

              <Box
                marginTop="10px"
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    md: 'row'
                  },
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <ButtonPrimary
                  as={Link}
                  to={`/liquidity/add/${index}`}
                  padding="4px"
                  width="100%"
                  style={{ color: theme.bg1, borderColor: theme.primary1, height: 48, fontSize: 16, fontWeight: 400 }}
                >
                  + Add New
                </ButtonPrimary>
                <ButtonPrimary
                  as={Link}
                  to={`/liquidity/remove/${index}`}
                  style={{ color: theme.bg1, borderColor: theme.primary1, height: 48, fontSize: 16, fontWeight: 400 }}
                  padding="4px"
                  width="100%"
                >
                  - Remove
                </ButtonPrimary>
              </Box>
            </AutoColumn>
          </Box>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}

export function FullPositionCardMini({ pair, stakedBalance, onRemove }: PositionCardProps & { onRemove: () => void }) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <DataCard
      rowHeight="23px"
      cardTitle={
        <RowBetween width="100%">
          <AutoRow gap="8px" width="100%">
            <div>
              <CurrencyLogo currency={currency0} size="24px"></CurrencyLogo>
              <CurrencyLogo currency={currency1} size="24px"></CurrencyLogo>
            </div>
            <Text fontWeight={500} fontSize={16}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </AutoRow>
          <ButtonOutlinedPrimary padding="4px" onClick={onRemove} width="120px">
            Remove
          </ButtonOutlinedPrimary>
        </RowBetween>
      }
      cardBottom={
        <ExternalLink
          style={{ textAlign: 'center', fontSize: 12, margin: '0 auto', justifySelf: 'center' }}
          href={`https://uniswap.info/account/${account}`}
        >
          View accrued fees and analytics
        </ExternalLink>
      }
      data={[
        {
          title: 'Your total pool tokens:',
          content: userPoolBalance ? userPoolBalance.toSignificant(4) : '-'
        },
        {
          title: `Pooled ${currency0.symbol}:`,
          content: token0Deposited ? (
            <>
              {token0Deposited?.toSignificant(6)}{' '}
              <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
            </>
          ) : (
            '-'
          )
        },
        {
          title: `Pooled ${currency1.symbol}:`,
          content: token1Deposited ? (
            <RowFixed>
              <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                {token1Deposited?.toSignificant(6)}
              </Text>
              <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
            </RowFixed>
          ) : (
            '-'
          )
        },
        {
          title: 'Your pool share:',
          content: poolTokenPercentage
            ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
            : '-'
        }
      ]}
    />
  )
}
