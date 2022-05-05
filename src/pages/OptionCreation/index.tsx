import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import Creation from './Creation'

const Wrapper = styled(AutoColumn)`
  margin-top: 100px;
  width: 100%;
  max-width: 600px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 20px;
  `}
`

export default function OptionCreation() {
  return (
    <Wrapper gap={'28px'}>
      <Creation />
    </Wrapper>
  )
}
