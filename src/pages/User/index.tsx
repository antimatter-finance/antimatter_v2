import React, { useCallback, useEffect, useState } from 'react'
import styled, { CSSProperties } from 'styled-components'
import { SwitchTabWrapper, Tab } from '../../components/SwitchTab'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { AnimatedImg, AnimatedWrapper, HideSmall, ShowSmall } from '../../theme'
import Loader from '../../assets/svg/antimatter_background_logo.svg'
import Table from '../../components/Table'
import { useMyTransaction, useMyCreation, useMyPosition } from '../../hooks/useUserFetch'
import Pagination from '../../components/Pagination'
import useMediaWidth from 'hooks/useMediaWidth'
import { useActiveWeb3React } from 'hooks'
import Image from 'components/Image'
import PositionIcon from 'assets/images/position-icon.png'
import CreationIcon from 'assets/images/creation-icon.png'
import HistoryIcon from 'assets/images/history-icon.png'
import { AutoRow } from 'components/Row'
import Card from 'components/Card'
import { Box, Typography } from '@mui/material'
import { ReactComponent as AntimatterIcon } from 'assets/svg/antimatter_icon.svg'
import Copy from 'components/AccountDetails/Copy'
import useENSName from '../../hooks/useENSName'
import { shortenAddress } from 'utils'

const Wrapper = styled.div`
  padding: calc(48px + ${({ theme }) => theme.headerHeight}); 0;
  width: 100%;
  max-width: 1110px;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 24px 0 40px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0 0 40px;
  width: 100%;
  `}
`

const AppBody = styled.div`
  width: 100%;
  background: linear-gradient(
    286.36deg,
    rgba(255, 255, 255, 0.18) -2.42%,
    rgba(255, 255, 255, 0.17) 19.03%,
    rgba(255, 255, 255, 0.114217) 57.75%,
    rgba(255, 255, 255, 0.0617191) 92.46%,
    rgba(255, 255, 255, 0) 100.04%
  );
  border-radius: 32px;
  /* padding: 52px; */
  max-width: 1284px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  background: transparent;
  padding: 32px 24px;
  `}
`

export enum UserInfoTabs {
  POSITION = 'my_position',
  CREATION = 'my_creation',
  TRANSACTION = 'my_transaction'
}
export const UserInfoTabRoute = {
  [UserInfoTabs.POSITION]: 'My Position',
  [UserInfoTabs.CREATION]: 'My Creation',
  [UserInfoTabs.TRANSACTION]: 'History'
}

// function randTime() {
//   return new Date(new Date().getTime() - Math.floor(Math.random() * 86400 * 1.2 * 1000))
// }
// const makeActiveData = () => [
//   'ETH ($1000 ~ $3000)',
//   'CALL',
//   Math.random() > 0.5 ? (
//     <>
//       <BuyIcon />
//       Buy
//     </>
//   ) : (
//     <>
//       <SellIcon />
//       Sell
//     </>
//   ),
//   '121',
//   showPassDateTime(randTime())
// ]
// const activeDatas = [makeActiveData(), makeActiveData(), makeActiveData(), makeActiveData(), makeActiveData()]

export default function User() {
  const history = useHistory()
  const { tab } = useParams<{ tab: string }>()
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(UserInfoTabs.POSITION)
  // const isUptoSmall = useMediaWidth('upToSmall')
  const { account } = useActiveWeb3React()
  const { ENSName } = useENSName(account ?? undefined)
  const isDownSm = useMediaWidth('upToSmall')

  useEffect(() => {
    if (!account) {
      history.push('/')
    }
  }, [account, history])

  const handleTabClick = useCallback(
    tab => () => {
      setCurrentTab(tab)
      history.push('/profile/' + tab)
    },
    [history]
  )

  useEffect(() => {
    if (tab && UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]) {
      setCurrentTab(tab as UserInfoTabs)
    }
  }, [location, tab])
  const { data: myTransaction, page: myTransactionPage, loading: myTransactionLoading } = useMyTransaction()

  const myCreation = useMyCreation()

  const { data: myPosition, loading: myPositionLoading } = useMyPosition()

  return (
    <Wrapper>
      <AppBody>
        <Box display="flex" gap={'20px'} alignItems="center" mb={'48px'}>
          <AntimatterIcon width={isDownSm ? '60px' : '72px'} height={isDownSm ? '60px' : '72px'} />
          <Box display="grid" gap={4}>
            <Typography sx={{ fontSize: 32, fontWeight: 700 }}>{ENSName || 'Unamed'}</Typography>
            <AutoRow>
              <Typography sx={{ opacity: 0.5 }}>{account && isDownSm ? shortenAddress(account) : account}</Typography>
              {account && <Copy toCopy={account} fixedSize />}
            </AutoRow>
          </Box>
        </Box>
        <SwitchTab onTabClick={handleTabClick} currentTab={currentTab} />
        {(currentTab === UserInfoTabs.CREATION && myCreation === undefined) ||
        (currentTab === UserInfoTabs.TRANSACTION && myTransactionLoading) ||
        (currentTab === UserInfoTabs.POSITION && myPositionLoading) ? (
          <>
            <HideSmall>
              <AnimatedWrapper style={{ marginTop: -100 }}>
                <AnimatedImg>
                  <img src={Loader} alt="loading-icon" />
                </AnimatedImg>
              </AnimatedWrapper>
            </HideSmall>
            <ShowSmall style={{ marginTop: 100 }}>
              <AnimatedWrapper>
                <AnimatedImg>
                  <img src={Loader} alt="loading-icon" />
                </AnimatedImg>
              </AnimatedWrapper>
            </ShowSmall>
          </>
        ) : (
          <Card margin="24px 0 auto" minHeight={480} padding="40px 25px">
            {currentTab === UserInfoTabs.POSITION && (
              <>
                <Table header={['Option', 'Type', 'Amount', 'Contract Address', '']} rows={myPosition} />
                {myPosition !== undefined && !myPosition.length && (
                  <p style={{ margin: 50 }}>You have no position at the moment</p>
                )}
              </>
            )}
            {currentTab === UserInfoTabs.CREATION && (
              <>
                <Table header={['Option', 'Type', 'Amount', 'Contract Address', '']} rows={myCreation ?? []} />

                {myCreation !== undefined && !myCreation.length && (
                  <p style={{ margin: 50 }}>You have no creation at the moment</p>
                )}
              </>
            )}

            {currentTab === UserInfoTabs.TRANSACTION && (
              <>
                <Table header={['Option', 'Type', 'Amount', 'Price', 'Action']} rows={myTransaction} />
                {myTransactionPage.totalPages !== 0 && (
                  <Box mt={12}>
                    <Pagination
                      page={myTransactionPage.currentPage}
                      count={myTransactionPage.totalPages}
                      perPage={8}
                      onChange={(event, value) => myTransactionPage.setCurrentPage(value)}
                      total={myTransactionPage.total}
                    />
                  </Box>
                )}
                {!myTransaction.length && !myTransactionLoading && (
                  <p style={{ margin: 50 }}>You have no transaction at the moment</p>
                )}
              </>
            )}
          </Card>
        )}
      </AppBody>
    </Wrapper>
  )
}

function SwitchTab({
  currentTab,
  onTabClick,
  style
}: {
  currentTab: UserInfoTabs
  onTabClick: (tab: UserInfoTabs) => () => void
  style?: CSSProperties
}) {
  const isDownSm = useMediaWidth('upToSmall')

  const accountIcons = {
    [UserInfoTabs.POSITION]: PositionIcon,
    [UserInfoTabs.CREATION]: CreationIcon,
    [UserInfoTabs.TRANSACTION]: HistoryIcon
  }

  return (
    <SwitchTabWrapper style={style}>
      {Object.keys(UserInfoTabRoute).map(tab => {
        const tabName = UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]
        return (
          <Tab key={tab} onClick={onTabClick(tab as UserInfoTabs)} selected={currentTab === tab}>
            <AutoRow>
              <Image
                src={accountIcons[tab as keyof typeof UserInfoTabRoute]}
                alt="my-position-icon"
                style={{ marginRight: isDownSm ? 8 : 12 }}
                width={isDownSm ? 20 : 28}
              />
              <Typography fontSize={isDownSm ? 14 : 20}>{tabName}</Typography>
            </AutoRow>
          </Tab>
        )
      })}
    </SwitchTabWrapper>
  )
}
