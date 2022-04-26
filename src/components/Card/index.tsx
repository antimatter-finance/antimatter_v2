import React from 'react'
import styled, { CSSProperties } from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import useTheme from 'hooks/useTheme'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
  maxWidth?: string
  margin?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  max-width: ${({ maxWidth }) => maxWidth};
  border-radius: 16px;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background: ${({ theme }) => theme.bg1};
  margin: ${({ margin }) => margin};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export const LightGreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg2};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg3};
`

export const OutlineCard = styled(Card)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text3};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primary1};
  border-radius: 12px;
  width: fit-content;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500}>{children}</Text>
    </BlueCardStyled>
  )
}

export const GradientCard = styled(Card)`
  background: ${({ theme }) => theme.gradient1};
  color: ${({ theme }) => theme.text1};
  font-weight: 500;
`
export const TranslucentCard = styled(Card)`
  background-color: ${({ theme }) => theme.translucent};
`

export const MainCard = styled(Card)`
  background-color: ${({ theme }) => theme.mainBG};
`

export function LabeledCard({
  label,
  content,
  style
}: {
  label?: string
  content: string | number | JSX.Element
  style?: CSSProperties
}) {
  const theme = useTheme()
  return (
    <AutoColumn gap="4px" style={{ width: '100%', ...style }}>
      {label && (
        <TYPE.body color={theme.text5} fontWeight={400} fontSize={12}>
          {label}
        </TYPE.body>
      )}
      <MainCard padding="12px 20px" style={{ height: 60, display: 'flex', alignItems: 'center' }}>
        {content}
      </MainCard>
    </AutoColumn>
  )
}
