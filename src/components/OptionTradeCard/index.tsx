import React from 'react'
import styled from 'styled-components'
import { Skeleton } from '@material-ui/lab'
import { MainCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import { useTotalSupply } from 'data/TotalSupply'
import { useOption } from 'state/market/hooks'
import { tryFormatAmount } from 'state/swap/hooks'
import { TYPE } from 'theme/index'
import AppBody from 'pages/AppBody'
import CurrencyLogo from 'components/CurrencyLogo'

const TitleWrapper = styled(RowFixed)`
  flex-wrap: nowrap;
  width: 100%;
`

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text1};
  width: calc(100% + 40px);
  margin: 0 -20px;
  opacity: 0.1;
`

const Circle = styled.div`
  flex-shrink: 0;
  margin-right: 16px;
  border-radius: 50%;
  border: 1px solid #00000010;
  background: #ffffff;
  height: 44px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`

// export function OptionTradeCardRaw({
//   option,
//   buttons,
//   optionId
// }: {
//   option: Option
//   buttons: JSX.Element
//   optionId: string | number
// }) {
//   const data = useMemo(() => {
//     const range = {
//       cap: tryFormatAmount(option?.priceCap, option?.currency ?? undefined),
//       floor: tryFormatAmount(option?.priceFloor, option?.currency ?? undefined)
//     }
//     const details = {
//       'Option Range': option ? `$${range.floor?.toExact().toString()}~$${range.cap?.toExact().toString()}` : '',
//       'Underlying Assets': option ? `${option.underlying?.symbol}, ${option.currency?.symbol}` : '-',
//       'Current Bear Issuance': option ? putTotalSupply?.toFixed(2).toString() : '-',
//       'Current Bull Issuance': option ? callTotalSupply?.toFixed(2).toString() : '-'
//     }
//     return { range, details }
//   }, [option])

//   return (
//     <MainCard padding="20px 24px 23px">
//       <AutoColumn gap="20px">
//         <TitleWrapper>
//           <Circle>
//             <CurrencyLogo
//               currencySymbol={option.underlying?.symbol}
//               currency={option?.underlying ?? undefined}
//               size="100%"
//             />
//           </Circle>
//           <AutoColumn gap="5px" style={{ width: '100%', position: 'relative', minHeight: 51 }}>
//             <TYPE.mediumHeader
//               fontSize={20}
//               style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
//             >
//               {`${option?.underlying?.symbol ?? '-'}`}
//             </TYPE.mediumHeader>

//             <RowFixed>ID:&nbsp;{option?.underlying ? optionId : '-'}</RowFixed>
//           </AutoColumn>
//         </TitleWrapper>
//         <Divider />
//         <AutoColumn gap="12px">
//           {Object.keys(data.details).map(key => (
//             <RowBetween key={key}>
//               <TYPE.body style={{ fontSize: 13, opacity: 0.6 }}>{key}</TYPE.body>
//               <TYPE.main
//                 style={{
//                   textAlign: 'right',
//                   overflow: 'hidden',
//                   whiteSpace: 'pre-wrap',
//                   textOverflow: 'ellipsis',
//                   minHeight: 19,
//                   fontWeight: 400,
//                   fontSize: 14
//                 }}
//               >
//                 {data.details[key as keyof typeof data.details]}
//               </TYPE.main>
//             </RowBetween>
//           ))}
//         </AutoColumn>
//         <RowBetween>{buttons}</RowBetween>
//       </AutoColumn>
//     </MainCard>
//   )
// }

export function OptionTradeCard({ optionId, buttons }: { optionId: string; buttons: JSX.Element }) {
  const option = useOption(optionId)
  const callTotalSupply = useTotalSupply(option?.call?.token)
  const putTotalSupply = useTotalSupply(option?.put?.token)

  const range = {
    cap: tryFormatAmount(option?.priceCap, option?.currency ?? undefined),
    floor: tryFormatAmount(option?.priceFloor, option?.currency ?? undefined)
  }
  const details = {
    'Option Range': option ? `$${range.floor?.toExact().toString()}~$${range.cap?.toExact().toString()}` : '',
    'Underlying Assets': option ? `${option.underlying?.symbol}, ${option.currency?.symbol}` : '-',
    'Current Bear Issuance': option ? putTotalSupply?.toFixed(2).toString() : '-',
    'Current Bull Issuance': option ? callTotalSupply?.toFixed(2).toString() : '-'
  }

  return (
    <>
      {option ? (
        <MainCard padding="20px 24px 23px">
          <AutoColumn gap="20px">
            <TitleWrapper>
              <Circle>
                <CurrencyLogo
                  currencySymbol={option.underlying?.symbol}
                  currency={option?.underlying ?? undefined}
                  size="100%"
                />
              </Circle>
              <AutoColumn gap="5px" style={{ width: '100%', position: 'relative', minHeight: 51 }}>
                <TYPE.mediumHeader
                  fontSize={20}
                  style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {`${option?.underlying?.symbol ?? '-'}`}
                </TYPE.mediumHeader>

                <RowFixed>
                  <TYPE.small>ID:&nbsp;{option?.underlying ? optionId : '-'}</TYPE.small>{' '}
                </RowFixed>
              </AutoColumn>
            </TitleWrapper>
            <Divider />
            <AutoColumn gap="12px">
              {Object.keys(details).map(key => (
                <RowBetween key={key}>
                  <TYPE.body style={{ fontSize: 13, opacity: 0.6 }}>{key}</TYPE.body>
                  <TYPE.main
                    style={{
                      textAlign: 'right',
                      overflow: 'hidden',
                      whiteSpace: 'pre-wrap',
                      textOverflow: 'ellipsis',
                      minHeight: 19,
                      fontWeight: 400,
                      fontSize: 14
                    }}
                  >
                    {details[key as keyof typeof details]}
                  </TYPE.main>
                </RowBetween>
              ))}
            </AutoColumn>
            <RowBetween>{buttons}</RowBetween>
          </AutoColumn>
        </MainCard>
      ) : (
        <OptionCardSkeleton />
      )}
    </>
  )
}

export function OptionCardSkeleton() {
  return (
    <AppBody isCard>
      <AutoColumn gap="20px">
        <TitleWrapper>
          <Skeleton variant="circle" height={44} width={44} animation="wave" />

          <AutoColumn gap="5px" style={{ position: 'relative', minHeight: 51, marginLeft: 16 }}>
            <Skeleton variant="rect" width={130} height={26} animation="wave" />
            <RowFixed>
              <Skeleton variant="text" width={50} height={24} animation="wave" />
            </RowFixed>
          </AutoColumn>
        </TitleWrapper>
        <Divider />
        <AutoColumn gap="12px">
          <Skeleton variant="text" width="100%" height={19} animation="wave" />
          <Skeleton variant="text" width="100%" height={19} animation="wave" />
          <Skeleton variant="text" width="50%" height={19} animation="wave" />
          <Skeleton variant="text" width="30%" height={19} animation="wave" />
        </AutoColumn>
        <Skeleton variant="rect" width="100%" height={49} animation="wave" style={{ borderRadius: 49 }} />
      </AutoColumn>
    </AppBody>
  )
}
