import React from 'react'
import styled from 'styled-components'
import { ButtonEmpty } from 'components/Button'

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.advancedBG};
  display: flex;
  align-items: center;
  box-sizing: border-box;
`

const TabWrapper = styled.div<{ active?: boolean }>`
  padding: 28px 0;
  margin-right: 52px;
  border-bottom: ${({ active, theme }) => (active ? `1px solid ${theme.primary1}` : 'none')};
  width: 'fit-content';
`

export default function Tab({
  current,
  options,
  setTab
}: {
  current: number
  options: (JSX.Element | string)[]
  setTab: (tab: number) => void
}) {
  return (
    <Wrapper>
      {options.map((option, idx) => {
        return (
          <TabWrapper active={idx === current}>
            <ButtonEmpty onClick={() => setTab(idx)}>{option}</ButtonEmpty>
          </TabWrapper>
        )
      })}
    </Wrapper>
  )
}
