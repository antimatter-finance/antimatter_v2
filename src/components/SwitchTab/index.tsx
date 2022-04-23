import React from 'react'
import styled from 'styled-components'

export const SwitchTabWrapper = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    overflow-x: auto;
    overflow-y: hidden;
    `};
`

export const Tab = styled.button<{ selected: boolean }>`
  border: none;
  background: none;
  padding: 14px 0;
  margin-right: 40px;
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};
  opacity: ${({ selected, theme }) => (selected ? 1 : 0.4)};
  border-bottom: 2px solid ${({ selected, theme }) => (selected ? theme.primary4 : 'transparent')};
  margin-bottom: -1px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary1};
  }
`

export default function SwitchTab({
  currentTab,
  onTabClick,
  tabs,
  tabStyle
}: {
  currentTab: string
  onTabClick: (tab: string) => () => void
  tabs: { [key: string]: string }
  tabStyle?: object
}) {
  return (
    <SwitchTabWrapper>
      {Object.keys(tabs).map(tab => {
        const tabName = tabs[tab as keyof typeof tabs]
        return (
          <Tab key={tab} onClick={onTabClick(tab)} selected={currentTab === tab} style={tabStyle}>
            {tabName}
          </Tab>
        )
      })}
    </SwitchTabWrapper>
  )
}
