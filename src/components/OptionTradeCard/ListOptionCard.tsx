import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import { TYPE } from 'theme'
import { MainCard } from 'components/Card'
import { OptionListData } from 'state/market/hooks'
import CurrencyLogo from 'components/CurrencyLogo'
import { OptionCardSkeleton } from '.'
import { useFormattedOptionListData } from 'hooks/useOptionList'

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

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text1};
  width: calc(100% + 40px);
  margin: 0 -20px;
  opacity: 0.1;
`

const TitleWrapper = styled(RowFixed)`
  flex-wrap: nowrap;
  width: 100%;
`

export function ListOptionCard({ buttons, option }: { buttons: JSX.Element; option: OptionListData }) {
  const data = useFormattedOptionListData(option)

  return (
    <>
      {option ? (
        <MainCard padding="20px 24px 23px">
          <AutoColumn gap="20px">
            <TitleWrapper>
              <Circle>
                <CurrencyLogo
                  currencySymbol={option?.underlyingSymbol}
                  currency={data?.underlying ?? undefined}
                  size="70%"
                />
              </Circle>
              <AutoColumn gap="5px" style={{ width: '100%', position: 'relative', minHeight: 51 }}>
                <TYPE.mediumHeader
                  fontSize={20}
                  style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {`${option?.underlyingSymbol ?? '-'}`}
                </TYPE.mediumHeader>

                <RowFixed>ID:&nbsp;{option?.optionIndex ?? '-'}</RowFixed>
              </AutoColumn>
            </TitleWrapper>
            <Divider />
            <AutoColumn gap="12px">
              {data?.details &&
                Object.keys(data.details).map(key => (
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
                      {data.details[key as keyof typeof data.details]}
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
