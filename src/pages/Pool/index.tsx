import React, { useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { TYPE } from '../../theme'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import { Dots } from '../../components/swap/styleds'
import AppBody from 'pages/AppBody'
import { useOptionTypeCount } from '../../state/market/hooks'
import { Typography } from '@mui/material'

const Wrapper = styled(AutoColumn)`
  margin-top: 100px;
  width: 100%;
  max-width: 600px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 20px;
  `}
`

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [status, setStatus] = useState<any>({})

  const optionCount = useOptionTypeCount()

  const optionIndexes = useMemo(() => {
    return Array.from({ length: optionCount }, (v, i) => i.toString())
  }, [optionCount])

  const list = useMemo(() => {
    return optionIndexes.map(item => {
      return (
        <FullPositionCard
          key={item}
          index={item}
          setStatus={(index, status) => {
            setStatus((prev: any) => ({ ...prev, [index]: status }))
          }}
        />
      )
    })
  }, [optionIndexes])

  const loading = Object.values(status).includes('loading')

  return (
    <Wrapper gap={'28px'}>
      <AppBody maxWidth="560px">
        <PageWrapper>
          <SwapPoolTabs active={'liquidity'} />

          <Typography fontSize={24} fontWeight={700} mb={28}>
            Your Positions
          </Typography>
          <AutoColumn gap="12px" style={{ width: '100%' }}>
            {!account ? (
              <Card padding="30px" border={`1px solid ${theme.text3}`} borderRadius="14px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : optionCount === 0 || loading ? (
              <Card padding="30px" border={`1px solid ${theme.text3}`} borderRadius="14px">
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </Card>
            ) : null}
            <>{list}</>
            <>
              {optionCount > 0 && !Object.values(status).includes('done') && !loading && (
                <Card padding="30px" border={`1px solid ${theme.text3}`} borderRadius="14px">
                  <TYPE.body color={theme.text3} textAlign="center">
                    You have no liquidity at the moment.
                  </TYPE.body>
                </Card>
              )}
            </>
          </AutoColumn>
        </PageWrapper>
      </AppBody>
    </Wrapper>
  )
}
