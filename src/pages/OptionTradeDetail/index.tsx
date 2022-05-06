import React, { useCallback } from 'react'
import OptionTradeAction from 'pages/OptionTradeDetail/OptionTradeAction'
import { RouteComponentProps, useHistory } from 'react-router-dom'

import SwitchChainModal from 'components/Modal/SwitchChainModal'

export default function OptionTradeDetail({
  match: {
    params: { optionId, chainId: chainIdParam }
  }
}: RouteComponentProps<{ optionId?: string; chainId?: string }>) {
  const history = useHistory()

  const handleDismiss = useCallback(() => {
    history.push(`/option_trading`)
  }, [history])

  return (
    <>
      <SwitchChainModal onDismiss={handleDismiss} toChainId={chainIdParam ? +chainIdParam : undefined} />
      <OptionTradeAction optionId={optionId} />
    </>
  )
}
