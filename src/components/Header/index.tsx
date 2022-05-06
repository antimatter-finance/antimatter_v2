import { ChainId } from '@uniswap/sdk'
import React, { useCallback, useMemo } from 'react'
import { Check, ChevronDown } from 'react-feather'
import { Link, NavLink, useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'
import { darken } from 'polished'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { ButtonText, ExternalHeaderLink, ExternalLink, HideMedium, StyledLink, TYPE } from '../../theme'
import Row, { RowFixed, RowFlat } from '../Row'
import Web3Status from '../Web3Status'
import { ReactComponent as Logo } from '../../assets/svg/antimatter_logo.svg'
import { ReactComponent as ETH } from '../../assets/svg/eth_logo.svg'
import { ReactComponent as BSCInvert } from '../../assets/svg/binance.svg'
import { ReactComponent as Arbitrum } from '../../assets/svg/arbitrum_logo.svg'
import { ReactComponent as AVAX } from '../../assets/svg/avax_logo.svg'
// import { ReactComponent as Plus } from '../../assets/svg/plus.svg'
import useTheme from 'hooks/useTheme'
import ToggleMenu from './ToggleMenu'
import { ReactComponent as AntimatterIcon } from 'assets/svg/antimatter_icon.svg'
import { AutoColumn } from 'components/Column'
import { shortenAddress } from 'utils'
import Copy from 'components/AccountDetails/Copy'
import { UserInfoTabRoute, UserInfoTabs } from 'pages/User'
import { useWalletModalToggle } from 'state/application/hooks'
import usePrevious from '../../hooks/usePrevious'
import { CountUp } from 'use-count-up/lib'
import { Symbol } from '../../constants'
import useMediaWidth from 'hooks/useMediaWidth'
import { SUPPORTED_NETWORKS } from 'constants/chains'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const tabs: Tab[] = [
  { title: 'Option Trading', route: 'option_trading' },
  {
    title: 'Option Creation',
    subTab: [
      { title: 'Option Creation', route: '/option_creation/creation' },
      { title: 'Liquidity', route: '/option_creation/liquidity' }
    ]
  },
  { title: 'Governance', link: 'https://governance.antimatter.finance' },
  { title: 'Calculator', route: 'calculator' },
  // { title: 'Farm', route: 'farm' },
  // {
  //   title: 'Tools',
  //   subTab: [
  // { title: 'Calculator', route: '/calculator' },
  // { title: 'Statistics', route: '/statistics' }
  //   ]
  // },
  {
    title: 'About',
    subTab: [
      { title: 'Docs', link: 'https://docs.antimatter.finance/' },
      // { title: 'Governance', link: 'https://governance.antimatter.finance' },
      {
        title: 'Auditing Report',
        link:
          'https://github.com/antimatter-finance/antimatter-assets/blob/main/PeckShield-Audit-Report-AntimatterFinance-v1.0.pdf'
      },
      {
        title: 'faq',
        titleContent: <FAQButton />,
        route: 'faq'
      }
    ]
  }
]

const NetworkInfo: {
  [key: number]: { title: string; color: string; icon: JSX.Element; link?: string; selectedIcon?: JSX.Element }
} = {
  [ChainId.MAINNET]: {
    color: '#FFFFFF',
    icon: <ETH />,
    title: 'ETH'
  },
  [ChainId.BSC]: {
    color: '#F0B90B',
    icon: <BSCInvert />,
    title: 'BSC'
  },
  [ChainId.Arbitrum]: {
    color: '#059BDC',
    icon: <Arbitrum />,
    title: 'Arbitrum'
  },
  [ChainId.Avalanche]: {
    color: '#FFFFFF',
    icon: <AVAX />,
    title: 'Avalanche'
  }
}

export const headerHeightDisplacement = '32px'

// const HeaderFrame = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   flex-direction: row;
//   width: 100%;
//   top: 0;
//   position: relative;
//   padding: 24px 0;
//   z-index: 99;
//   background-color: ${({ theme }) => theme.bg1};
//   height: ${({ theme }) => theme.headerHeight};
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     grid-template-columns: 1fr;
//     padding: 0 1rem;
//     width: 100%;
//     position: relative;
//   `};
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//         padding: 0.5rem 1rem;
//   `}
// `

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 2rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-right: 7px;
`};
`

const HeaderRow = styled(RowFixed)`
  width: 100%;
  padding-left: 2rem;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bg1};
  height: ${({ theme }) => theme.headerHeight};
  position: fixed;
  z-index: 100;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none
  `};
`

const HeaderLinks = styled(Row)`
  margin-left: 80px;
  justify-content: center;
  align-items: center;
  width: auto;
  z-index: 99;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    display: none
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 32px;
  white-space: nowrap;
  padding: ${({ active }) => (active ? '14px 16px' : 'unset')};
  padding-right: 0;
  height: 36px;
  background-color: ${({ theme }) => theme.mainBG};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 24px;
  `}
`

const UNIAmount = styled.div`
  color: ${({ theme }) => theme.bg1};
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  &:after {
    content: '';
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    margin-left: 16px;
    margin-right: 16px;
    height: 20px;
  }
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
`

const NetworkCard = styled.div<{ color?: string }>`
  color: #000000;
  cursor: pointer;
  display: flex;
  padding: 8px 10px;
  height: 32px;
  margin-right: 6px;
  justify-content: center;
  border-radius: 4px;
  align-items: center;
  background-color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  & > svg:first-child {
    height: 20px;
    width: 20px;
  }
  .dropdown_wrapper {
    & > div {
      a {
        padding: 12px 12px 12px 44px;
      }
    }
  }

  :hover {
    cursor: pointer;
    .dropdown_wrapper {
      top: 100%;
      left: -20px;
      height: 10px;
      position: absolute;
      width: 172px;
      & > div {
        height: auto;
        margin-top: 10px;
        border: 1px solid #ededed;
        a {
          position: relative;
          & > svg {
            height: 20px;
            width: 20px;
            margin-right: 15px;
          }
        }
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 5px 6px;
    width: 42px;
    height: 28px;
`}
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text5};
  font-size: 14px;
  width: fit-content;
  font-weight: 400;
  padding: 32px 0;
  white-space: nowrap;
  transition: 0.5s;
  ${({ theme }) => theme.flexRowNoWrap}
  &.${activeClassName} {
    color: ${({ theme }) => theme.text1};
    border-bottom: 1px solid ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.primary1)};
  };
  margin: 0 22px;
`

const StyledExternalHeaderLink = styled(ExternalHeaderLink)`
  margin: 0 22px;
  padding: 32px 0;
  color: ${({ theme }) => theme.text5};
`

const StyledDropdown = styled.div`
  align-items: flex-start;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text5};
  font-size: 14px;
  width: fit-content;
  margin: 0 18px;
  font-weight: 400;
  padding: 32px 0;
  transition: 0.5s;
  position: relative;
  ${({ theme }) => theme.flexRowNoWrap}

  svg {
    margin-left: 5px;
  }
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.primary1)};
    > svg {
      transform: rotate(180deg);
    }
    #plus {
      transform: unset;
      #hover {
        fill: url(#Gradient1);
      }
    }
    & > div {
      top: 60px;
      height: auto;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 22px;
  `};
`
const Dropdown = styled.div<{ width?: string }>`
  z-index: 3;
  height: 0;
  position: absolute;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: ${({ width }) => width ?? '172px'};
  a {
    color: #000000;
    background-color: #ffffff;
    text-decoration: none;
    padding: 14px 17px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    transition: 0.5s;
    display: flex;
    align-items: center;
    :last-child {
      border: none;
    }
    :hover {
      background-color: ${({ theme }) => theme.mainBG};
      color: ${({ theme }) => darken(0.1, theme.primary1)};
    }
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  border: none;
  margin: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const UserButtonWrap = styled.div`
  margin-left: 5px;
  position: relative;
  :hover {
    #userButton {
      :hover,
      :focus {
        background: linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
          linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);
      }
    }
    div {
      opacity: 1;
      visibility: visible;
    }
  }
  div {
    opacity: 0;
    visibility: hidden;
  }
`
const UserMenuItem = styled.button`
  padding: 12px 24px;
  width: 100%;
  border: none;
  background-color: transparent;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  :hover {
    background-color: #ededed;
  }
`

const UserButton = styled(ButtonText)<{ isOpen: boolean; size?: string }>`
  height: ${({ size }) => size ?? '36px'};
  width: ${({ size }) => size ?? '36px'};
  border-radius: 50%;
  background: ${({ isOpen }) =>
    isOpen
      ? `linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
  linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);`
      : `linear-gradient(360deg, #66d7fa 0%, rgba(207, 209, 86, 0) 50%),
    linear-gradient(259.57deg, #66d7fa 1.58%, #66d7fa 92.54%);`};
  border: none;
  flex-shrink: 0;
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  :disabled {
    cursor: auto;
  }
  :hover {
    background: linear-gradient(360deg, #fffa8b 0%, rgba(207, 209, 86, 0) 50%),
      linear-gradient(259.57deg, #b2f355 1.58%, #66d7fa 92.54%);
  }
`
const UserMenuWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 2000;
  min-width: 15rem;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  transition-duration: 0.3s;
  transition-property: visibility, opacity;
  display: flex;
  border: 1px solid #ededed;
  flex-direction: column;
  & > div:first-child {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    width: 100%;
  }
  & > button:last-child {
    padding: 16px 24px;
    border-top: 1px solid #ededed;
  }
`

function FAQButton() {
  const theme = useTheme()
  return (
    <RowFixed>
      <RowFixed
        justify="center"
        style={{
          borderRadius: '50%',
          border: `1px solid ${theme.primary1}`,
          width: '18px',
          height: '18px',
          marginRight: '12px'
        }}
      >
        <TYPE.body fontSize={14} color={theme.primary1}>
          ?
        </TYPE.body>
      </RowFixed>
      FAQ
    </RowFixed>
  )
}

const MobileHeader = styled.header`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;
  background-color: ${({ theme }) => theme.bg1};
  height: ${({ theme }) => theme.mobileHeaderHeight};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex
  `};
`

export default function Header() {
  const theme = useTheme()
  const { account, chainId, library } = useActiveWeb3React()
  // const [, setChain] = useState<any>(undefined)
  const aggregateBalance = useETHBalances([account ?? undefined])[account ?? '']

  const countUpValue = aggregateBalance?.toFixed(2) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  const isDownSm = useMediaWidth('upToSmall')

  const history = useHistory()
  const match = useRouteMatch('/profile')
  const toShowUserPanel = useCallback(() => {
    history.push('/profile')
    return
  }, [history])

  // useEffect(() => {
  //   setChain((prev: any) => {
  //     if (prev !== undefined && prev !== chainId) {
  //       window.location.replace('/')
  //     }
  //     return chainId
  //   })
  // }, [chainId])

  const NetworkSelect = useMemo(() => {
    return (
      account &&
      chainId &&
      NetworkInfo[chainId] && (
        <NetworkCard title={NetworkInfo[chainId].title} color={NetworkInfo[chainId as number]?.color}>
          {NetworkInfo[chainId].selectedIcon ? NetworkInfo[chainId].selectedIcon : NetworkInfo[chainId].icon}
          <span style={{ marginRight: 4 }} />
          {!isDownSm && NetworkInfo[chainId].title}
          <ChevronDown size={18} style={{ marginLeft: '5px', color: theme.text5 }} />
          <div className="dropdown_wrapper">
            <Dropdown>
              {Object.keys(NetworkInfo).map(key => {
                const info = NetworkInfo[parseInt(key) as keyof typeof NetworkInfo]
                if (!info) {
                  return null
                }
                return info.link ? (
                  <ExternalLink href={info.link} key={info.link}>
                    {parseInt(key) === chainId && (
                      <span style={{ position: 'absolute', left: '15px' }}>
                        <Check size={18} />
                      </span>
                    )}
                    {info.icon ?? info.icon}
                    {info.title}
                  </ExternalLink>
                ) : (
                  <StyledLink
                    key={info.title}
                    onClick={() => {
                      if (parseInt(key) === ChainId.MAINNET) {
                        library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                      } else if (parseInt(key) === ChainId.ROPSTEN) {
                        library?.send('wallet_switchEthereumChain', [{ chainId: '0x3' }, account])
                      } else {
                        const params = SUPPORTED_NETWORKS[parseInt(key) as ChainId]
                        library?.send('wallet_addEthereumChain', [params, account])
                      }
                    }}
                  >
                    {parseInt(key) === chainId && (
                      <span style={{ position: 'absolute', left: '15px' }}>
                        <Check size={18} />
                      </span>
                    )}
                    {info.icon ?? info.icon}
                    {info.title}
                  </StyledLink>
                )
              })}
            </Dropdown>
          </div>
        </NetworkCard>
      )
    )
  }, [account, chainId, isDownSm, library, theme])

  return (
    <>
      <HeaderRow>
        <HideMedium>
          <RowFixed>
            <LogoButton />

            <HeaderLinks>
              {tabs.map(({ title, route, link, subTab }) => {
                if (subTab) {
                  return (
                    <StyledDropdown key={title}>
                      {title}
                      <ChevronDown size={15} />
                      <Dropdown>
                        {subTab.map(({ title, route, link, titleContent }) => {
                          return link ? (
                            <ExternalLink href={link} key={title}>
                              {titleContent ?? title}
                            </ExternalLink>
                          ) : route ? (
                            <NavLink to={route} key={title}>
                              {titleContent ?? title}
                            </NavLink>
                          ) : null
                        })}
                      </Dropdown>
                    </StyledDropdown>
                  )
                }
                if (route === 'option_exercise') {
                  return (
                    <StyledNavLink
                      key={route}
                      to={`/${route}`}
                      isActive={(match, { pathname }) =>
                        Boolean(match) || pathname.startsWith('/generate') || pathname.startsWith('/redeem')
                      }
                    >
                      {title}
                    </StyledNavLink>
                  )
                }
                return (
                  <React.Fragment key={title}>
                    {link ? (
                      <StyledExternalHeaderLink href={link} key={title}>
                        {title}
                      </StyledExternalHeaderLink>
                    ) : (
                      <StyledNavLink id={`stake-nav-link`} to={'/' + route} key={route}>
                        {title}
                      </StyledNavLink>
                    )}
                  </React.Fragment>
                )
              })}
            </HeaderLinks>
          </RowFixed>
        </HideMedium>
        <HeaderControls>
          {NetworkSelect}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {!!account && aggregateBalance && (
              <UNIWrapper>
                <UNIAmount style={{ pointerEvents: 'none' }}>
                  {account && (
                    <p
                      style={{
                        paddingRight: '.4rem',
                        color: theme.text1
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </p>
                  )}
                  <span style={{ color: theme.text1 }}> {Symbol[chainId ?? 1]}</span>
                </UNIAmount>
              </UNIWrapper>
            )}
            <Web3Status />
            {account && (
              <UserButtonWrap>
                <UserButton id="userButton" onClick={toShowUserPanel} isOpen={!!match}>
                  <AntimatterIcon />
                </UserButton>
                <UserMenu account={account} />
              </UserButtonWrap>
            )}
          </AccountElement>
        </HeaderControls>
      </HeaderRow>
      <MobileHeader>
        <LogoButton />
        <HeaderControls>
          {NetworkSelect}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto', marginRight: 8 }}>
            <Web3Status />
            {account && (
              <UserButtonWrap>
                <UserButton id="userButton" onClick={toShowUserPanel} isOpen={!!match} size={'24px'}>
                  <AntimatterIcon />
                </UserButton>
                <UserMenu account={account} />
              </UserButtonWrap>
            )}
          </AccountElement>
          <ToggleMenu />
        </HeaderControls>
      </MobileHeader>
    </>
  )
}

function LogoButton() {
  const isDownSm = useMediaWidth('upToSmall')

  return (
    <RowFlat style={{ alignItems: 'center' }}>
      <Link to={'/'}>
        <Logo width={isDownSm ? 100 : 140} />
      </Link>
      {/* <StyledDropdown style={{ color: '#ffffff', padding: '6px 25px 18px 20px', margin: 0 }}>
        <Plus style={{ margin: 'auto auto' }} />
        <Dropdown>
          <ExternalLink href={'https://v1.antimatter.finance'}>Antimatter Option V1</ExternalLink>
          <ExternalLink href={'https://nonfungible.finance/#/'}>
            <span style={{ whiteSpace: 'nowrap' }}>Antimatter NFT</span>
          </ExternalLink>
        </Dropdown>
      </StyledDropdown> */}
    </RowFlat>
  )
}

function UserMenu({ account }: { account?: string | null }) {
  const toggleWalletModal = useWalletModalToggle()
  const history = useHistory()

  return (
    <UserMenuWrapper>
      <div>
        <UserButton isOpen={true} disabled size="28px">
          <AntimatterIcon />
        </UserButton>
        <TYPE.darkGray fontWeight={400} style={{ marginLeft: 15 }}>
          {account && shortenAddress(account)}
        </TYPE.darkGray>
        {account && <Copy toCopy={account} fixedSize />}
      </div>
      <div>
        <AutoColumn style={{ width: '100%' }}>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.POSITION)}>
            {UserInfoTabRoute[UserInfoTabs.POSITION]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.CREATION)}>
            {UserInfoTabRoute[UserInfoTabs.CREATION]}
          </UserMenuItem>
          <UserMenuItem onClick={() => history.push('/profile/' + UserInfoTabs.TRANSACTION)}>
            {UserInfoTabRoute[UserInfoTabs.TRANSACTION]}
          </UserMenuItem>
          <UserMenuItem onClick={toggleWalletModal}>Wallet</UserMenuItem>
        </AutoColumn>
      </div>
    </UserMenuWrapper>
  )
}
