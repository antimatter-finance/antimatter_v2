import React, { useCallback } from 'react'
import { ChainId } from '@uniswap/sdk'
import Modal from '.'
import { CloseIcon } from 'theme/index'
import { useActiveWeb3React } from 'hooks'
import { ButtonPrimary } from 'components/Button'
import { Box, Typography } from '@mui/material'
import { OutlineCard } from 'components/Card'
import { SUPPORTED_NETWORKS } from 'constants/chains'
import CurrencyLogo from 'components/CurrencyLogo'

export default function SwitchChainModal({
  toChainId,
  onDismiss
}: {
  toChainId: ChainId | undefined
  onDismiss: () => void
}) {
  const { chainId, account, library } = useActiveWeb3React()

  const handleSwitchChain = useCallback(() => {
    if (!toChainId) return
    const toChain = SUPPORTED_NETWORKS[toChainId as keyof typeof SUPPORTED_NETWORKS]
    if ([1, 3, 4, 5, 42].includes(toChainId)) {
      library?.send('wallet_switchEthereumChain', [{ chainId: toChain?.chainId }, account])
    } else {
      library?.send('wallet_addEthereumChain', [toChain, account])
    }
  }, [account, library, toChainId])

  return (
    <Modal isOpen={!!(toChainId && toChainId !== chainId)} onDismiss={onDismiss}>
      <Box display="grid" width="100%" position="relative">
        <Box position="absolute" top={20} right={20}>
          <CloseIcon onClick={onDismiss} />
        </Box>

        <Box padding="40px" display="grid" gap="32px" justifyItems="center" width="100%">
          <Typography variant="h6">Switch Chain</Typography>
          {chainId && toChainId && (
            <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
              <OutlineCard width="100%" style={{ borderColor: '#999999' }}>
                <Box
                  display="grid"
                  justifyItems="center"
                  gap="20px"
                  margin="0 auto"
                  padding="30px 20px 40px"
                  height="168px"
                  maxHeight="168px"
                  maxWidth="168px"
                >
                  <CurrencyLogo
                    size={'44px'}
                    currencySymbol={
                      SUPPORTED_NETWORKS[(chainId as keyof typeof SUPPORTED_NETWORKS) ?? 1]?.nativeCurrency.symbol
                    }
                  />

                  <Typography variant="inherit" align="center">
                    {SUPPORTED_NETWORKS[(chainId as keyof typeof SUPPORTED_NETWORKS) ?? 1]?.chainName}
                  </Typography>
                </Box>
              </OutlineCard>
              <svg
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                style={{
                  margin: '0px 20px',
                  flexShrink: 0,
                  width: '1em',
                  height: '1em',
                  fontSize: '1.5rem',
                  display: 'inline-block'
                }}
              >
                <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
              </svg>
              <OutlineCard width="100%" style={{ borderColor: '#999999' }}>
                <Box
                  display="grid"
                  justifyItems="center"
                  gap="20px"
                  margin="0 auto"
                  padding="30px 20px 40px"
                  maxHeight="168px"
                  height="168px"
                  maxWidth="168px"
                >
                  <CurrencyLogo
                    size={'44px'}
                    currencySymbol={
                      SUPPORTED_NETWORKS[(toChainId as keyof typeof SUPPORTED_NETWORKS) ?? 1]?.nativeCurrency.symbol
                    }
                  />
                  <Typography variant="inherit" align="center">
                    {SUPPORTED_NETWORKS[(toChainId as keyof typeof SUPPORTED_NETWORKS) ?? 1]?.chainName}
                  </Typography>
                </Box>
              </OutlineCard>
            </Box>
          )}
          <ButtonPrimary onClick={handleSwitchChain} style={{ whiteSpace: 'normal' }}>
            Switch to {SUPPORTED_NETWORKS[(toChainId as keyof typeof SUPPORTED_NETWORKS) ?? 1]?.chainName}
          </ButtonPrimary>
        </Box>
      </Box>
    </Modal>
  )
}
