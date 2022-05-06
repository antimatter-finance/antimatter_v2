import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
// import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
// import { ApplicationModal } from '../state/application/actions'
// import { useModalOpen, useToggleModal } from '../state/application/hooks'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Generate from './Generate'
import Redeem from './Redeem'
// import ComingSoon from './ComingSoon'
import Info from './Info'
import WelcomeSlider from 'components/WelcomeSlider'
import FAQ from './FAQ'
import OptionTrade from './OptionTrade'
import OptionCreation from './OptionCreation'
import OptionExercise from './OptionExercise'
import Stats from './Stats'
import ComingSoon from './ComingSoon'
import User from './User'
import Calculator from './Calculator'
import WarningModal from 'components/Modal/WarningModal'
import Pool from './Pool'
import OptionTradeDetail from './OptionTradeDetail'
// import Spinner from 'components/Spinner'
// import NoService from './NoService'
// import { fetchLocation } from '../utils/option/location'

const AppWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.mainBG};
  min-width: ${({ theme }) => theme.minContentWidth};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  height: 100vh;
  `}
`
const ContentWrapper = styled.div`
  width: 100%;
  max-height: 100vh;
  overflow: auto;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   align-items: center;
   min-width: auto;
  `};
`

const HeaderWrapper = styled.div`
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  ${({ theme }) => theme.flexRowNoWrap}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height: 0;
  // overflow: hidden
  min-width: 0;
  `}
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight});
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding-bottom: 100px;
  /* ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-bottom: ${theme.headerHeight};
  min-height: calc(100vh - ${theme.headerHeight + ' - ' + theme.mobileHeaderHeight});
  `} */
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding-bottom: 0;
  min-width: auto;
  margin-top: ${({ theme }) => theme.mobileHeaderHeight}
  min-height: calc(100vh - ${theme.headerHeight + ' - ' + theme.mobileHeaderHeight});
  `};
`

export const Marginer = styled.div`
  ${({ theme }) => theme.desktop}
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }
// const resource = fetchLocation()

export default function App() {
  return (
    <Suspense fallback={null}>
      {/* <Feedback
        href={
          'https://docs.google.com/forms/d/e/1FAIpQLSfyWq7xlI_ro72-n9rM-disc7extCoVw5oUiOQND7fnh1c80g/viewform?usp=pp_url'
        }
      >
        <img alt="" src={Helper} />
      </Feedback> */}
      <AppWrapper id="app">
        {/* <URLWarning /> */}
        <ContentWrapper>
          <HeaderWrapper id="header">
            <Header />
          </HeaderWrapper>
          <BodyWrapper id="body">
            <Popups />
            <Polling />
            <WelcomeSlider />
            <WarningModal />
            {/* <TopLevelModals /> */}
            <Web3ReactManager>
              <>
                {/* <LocatoinVerification resource={resource}> */}
                <Switch>
                  <Route exact strict path="/option_creation/creation" component={OptionCreation} />
                  <Route exact strict path="/option_creation/liquidity" component={Pool} />
                  <Route exact strict path="/option_trading" component={OptionTrade} />
                  <Route exact strict path="/calculator" component={Calculator} />
                  <Route exact strict path="/option_trading/:chainId/:optionId" component={OptionTradeDetail} />
                  <Route exact strict path="/option_exercise" component={OptionExercise} />
                  <Route exact strict path="/liquidity/add/:optionTypeIndex" component={Generate} />
                  {/* <Route exact strict path="/redeem" component={Redeem} /> */}
                  <Route exact strict path="/liquidity/remove/:optionTypeIndex" component={Redeem} />
                  <Route exact strict path="/governance" component={ComingSoon} />
                  <Route exact strict path="/info" component={Info} />
                  <Route strict path="/profile/:tab" component={User} />
                  <Route strict path="/profile" component={User} />
                  <Route exact strict path="/statistics" component={Stats} />
                  {/* <Route exact strict path="/exercise" component={Exercise} /> */}
                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  {/* <Route exact strict path="/send" component={RedirectPathToSwapOnly} /> */}
                  {/* <Route exact strict path="/farm" component={MatterToken} /> */}
                  <Route exact strict path="/faq" component={FAQ} />
                  <Route component={RedirectPathToSwapOnly} />
                </Switch>
                {/* </LocatoinVerification> */}
              </>
            </Web3ReactManager>
          </BodyWrapper>
        </ContentWrapper>
      </AppWrapper>
    </Suspense>
  )
}

// const isDev = process.env.NODE_ENV === 'development'
// function LocatoinVerification({ resource, children }: { resource: { read(): any }; children: React.ReactNode }) {
//   const location = resource.read()

//   return (
//     <Suspense fallback={<Spinner size={100} />}>
//       {!isDev && (location === 'US' || location === 'CN' || !location) && false ? <NoService /> : children}
//       {/*{location === 'US' || location === 'CN' || !location || location === 'Not found' ? children : children}*/}
//     </Suspense>
//   )
// }
