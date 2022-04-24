import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  width: 50%;
  height: 44px;
  line-height: 48px;
  border-radius: 12px;
  background: ${({ theme, isActive }) => (isActive ? theme.bg1 : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text5)};
  font-size: 16px;
  font-weight: 400;

  padding: 0 0.6rem;
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.text1 : theme.text5) : theme.text3)};
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 16px;
  background: ${({ theme }) => theme.mainBG};
  display: flex;
  width: 100%;
  cursor: pointer;
  padding: 8px;
  border: none;
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        CALL
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
        PUT
      </ToggleElement>
    </StyledToggle>
  )
}
