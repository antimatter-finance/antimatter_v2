import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import Creation from './Creation'
import Pool from '../Pool'

const Wrapper = styled(AutoColumn)`
  margin-top: 100px;
  width: 100%;
  max-width: 600px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 20px;
  `}
`

export default function OptionCreation() {
  const { tab } = useParams<{ tab: string }>()

  return (
    <Wrapper gap={'28px'}>
      {tab === 'creation' && <Creation />}
      {tab === 'liquidity' && <Pool />}
    </Wrapper>
  )
}
