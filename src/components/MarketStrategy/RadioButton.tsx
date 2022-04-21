import React from 'react'
import styled from 'styled-components'

const Label = styled.label<{ checked: boolean }>`
  wrap: nowrap;
  display: flex;
  align-items: center;
  :before {
    content: '';
    display: block;
    width: 14px;
    height: 14px;
    background-color: ${({ theme, checked }) => (checked ? theme.text1 : theme.mainBG)};
    border-radius: 50%;
    margin-right: 12px;
    border: 7px solid ${({ theme }) => theme.mainBG};
  }
  & input {
    display: none;
  }
`

export function RadioButton({
  label,
  name,
  checked,
  onCheck
}: {
  label: string
  name: string
  checked: boolean
  onCheck: () => void
}) {
  return (
    <Label checked={checked}>
      <input type="radio" name={name} checked={checked} onChange={onCheck} />
      {label}
    </Label>
  )
}
