import React from 'react'
import styled from 'styled-components'
import { ButtonEmpty } from 'components/Button'

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: 32px;
`

const TabWrapper = styled.div<{ active?: boolean }>`
  border-bottom: ${({ active, theme }) => (active ? `1px solid ${theme.primary1}` : 'none')};
  width: 'fit-content';
  opacity: ${({ active }) => (active ? 1 : 0.4)};
  padding: 30px 0;
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
          <TabWrapper key={idx} active={idx === current}>
            <ButtonEmpty onClick={() => setTab(idx)} style={{ padding: 0 }}>
              {option}
            </ButtonEmpty>
          </TabWrapper>
        )
      })}
    </Wrapper>
  )
}
