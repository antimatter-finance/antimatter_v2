import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { TYPE } from '../../theme'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { Dots } from '../../components/swap/styleds'
// import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import AppBody from 'pages/AppBody'
import { useOptionTypeCount } from '../../state/market/hooks'
import { Typography } from '@mui/material'

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

// const VoteCard = styled(DataCard)`
//   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
//   overflow: hidden;
// `

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const optionCount = useOptionTypeCount()

  const optionIndexes = useMemo(() => {
    return Array.from({ length: optionCount }, (v, i) => i.toString())
  }, [optionCount])

  return (
    <>
      <AppBody maxWidth="560px">
        <PageWrapper>
          <SwapPoolTabs active={'liquidity'} />

          <Typography fontSize={24} fontWeight={700} mb={28}>
            Your Positions
          </Typography>
          {/*<ResponsiveButtonPrimary*/}
          {/*  style={{ width: '100%' }}*/}
          {/*  id="join-pool-button"*/}
          {/*  as={Link}*/}
          {/*  padding="14px 10px"*/}
          {/*  to="/add/ETH"*/}
          {/*>*/}
          {/*  <Text fontWeight={500} fontSize={16}>*/}
          {/*    Add Liquidity*/}
          {/*  </Text>*/}
          {/*</ResponsiveButtonPrimary>*/}
          <AutoColumn gap="12px" style={{ width: '100%' }}>
            {!account ? (
              <Card padding="12px" border={`1px solid ${theme.text3}`} borderRadius="14px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : optionCount === 0 ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : (
              <>
                {optionIndexes.map(item => {
                  return <FullPositionCard key={item} index={item} />
                })}
              </>
            )}
            {/*<AutoColumn justify={'center'} gap="md">*/}
            {/*  <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>*/}
            {/*    {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}*/}
            {/*    <StyledInternalLink*/}
            {/*      id="import-pool-link"*/}
            {/*      to={hasV1Liquidity ? '/migrate/v1' : '/find'}*/}
            {/*      style={{ color: theme.text1 }}*/}
            {/*    >*/}
            {/*      {hasV1Liquidity ? 'Migrate now' : 'Import it'}*/}
            {/*    </StyledInternalLink>*/}
            {/*  </Text>*/}
            {/*</AutoColumn>*/}
          </AutoColumn>
        </PageWrapper>
      </AppBody>
    </>
  )
}
