import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts'
import styled from 'styled-components'
import Swap, { OptionField } from '../Swap'
import { Option, OptionPrice } from '../../state/market/hooks'
// import SwitchTab from 'components/SwitchTab'
import { Axios } from 'utils/option/axios'
import { useActiveWeb3React } from 'hooks'
import { useNetwork } from 'hooks/useNetwork'
// import { ButtonOutlinedPrimary } from 'components/Button'
import { formatDexTradeLineData, DexTradeLineData } from 'utils/option/utils'
import { TYPE } from 'theme'
import { Grid } from '@mui/material'
import { useTotalSupply } from '../../data/TotalSupply'
import { tryFormatAmount } from '../../state/swap/hooks'
import { Typography, Box } from '@mui/material'
import { shortenAddress } from 'utils'

const GraphWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-bottom: ${({ theme }) => theme.mobileHeaderHeight}
  `}
  background: #ffffff;
  padding: 32px 24px;
  border-radius: 20px;
`

const Chart = styled.div`
  background-color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3px;
`
// const ChartWrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   margin-left: 3px;
//   position: relative;
// `

// const ButtonGroup = styled.div`
//   width: 100%;
//   display: flex;
//   margin-bottom: 24px;
//   button:first-child {
//     margin-right: 10px;
//   }
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//   button{
//     font-size: 14px
//   }
//   `}
// `
// const Button = styled(ButtonOutlinedPrimary)<{ isActive: boolean }>`
//   flex-grow: 0;
//   padding: 6px 14px;
//   width: auto !important;
//   :focus {
//     border-color: ${({ theme }) => theme.primary1};
//     color: ${({ theme }) => theme.primary1};
//   }
//   ${({ isActive, theme }) => (!isActive ? `border-color:${theme.text3}; color:${theme.text3};` : '')}
// `

const CurrentPrice = styled.div`
  position: absolute;
  right: 23px;
  top: 42px;
`

export default function OptionSwap({
  optionId,
  option,
  // handleOptionType,
  optionPrice
}: {
  optionId: string
  option?: Option
  // handleOptionType: (option: string) => void
  optionPrice: OptionPrice | undefined
}) {
  const transactions = useSelector((store: any) => store.transactions)
  const { chainId } = useActiveWeb3React()
  const [currentTab, setCurrentTab] = useState<string>('CALL')
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Area'> | undefined>(undefined)
  // const [isMarketPriceChart, setIsMarketPriceChart] = useState(true)
  const [chart, setChart] = useState<IChartApi | undefined>(undefined)
  const [callChartData, setCallChartData] = useState<DexTradeLineData[] | undefined>(undefined)
  const [putChartData, setPutChartData] = useState<DexTradeLineData[] | undefined>(undefined)
  const [graphLoading, setGraphLoading] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [refresh, setRefresh] = useState(0)

  const handleHash = useCallback(hash => setTxHash(hash), [])

  const priceCall = optionPrice?.priceCall
  const pricePut = optionPrice?.pricePut
  const callTotalSupply = useTotalSupply(option?.call?.token)
  const putTotalSupply = useTotalSupply(option?.put?.token)

  const {
    httpHandlingFunctions: { errorFunction, pendingFunction, pendingCompleteFunction },
    NetworkErrorModal,
    NetworkPendingSpinner
  } = useNetwork()

  useEffect(() => {
    if (chainId && transactions?.[chainId]?.[txHash]?.receipt?.status === 1) {
      setRefresh(re => re + 1)
    }
  }, [transactions, chainId, txHash])

  useEffect(() => {
    setTxHash('')
    pendingFunction()
    const callId = option?.callToken?.address ?? undefined
    const putId = option?.putToken?.address ?? undefined

    if (!callId || !putId) return

    const complete = { call: false, put: false }

    if (callId) {
      Axios.get('getDexTradesList', { chainId: chainId, tokenAddress: callId })
        .then(r => {
          complete.call = true
          if (r.data) {
            setCallChartData(formatDexTradeLineData(r.data.data))
          }
          if (complete.put) {
            pendingCompleteFunction()
            setGraphLoading(false)
          }
        })
        .catch(() => errorFunction())
    }
    if (putId) {
      Axios.get('getDexTradesList', { chainId: chainId, tokenAddress: putId })
        .then(r => {
          complete.put = true
          if (r.data) {
            setPutChartData(formatDexTradeLineData(r.data.data))
          }
          if (complete.call) {
            pendingCompleteFunction()
            setGraphLoading(false)
          }
        })
        .catch(() => errorFunction())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chainId,
    errorFunction,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    option?.callToken?.address,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    option?.putToken?.address,
    pendingCompleteFunction,
    pendingFunction,
    refresh
  ])

  useEffect(() => {
    const chartElement = document.getElementById('chart') ?? ''
    const chart = createChart(chartElement, {
      width: chartElement ? chartElement.offsetWidth : 556,
      height: 328,
      layout: {
        backgroundColor: '#FFFFFF',
        textColor: 'rgba(13,13, 13, 0.4)',
        fontSize: 12,
        fontFamily: 'SF Pro, sans-serif'
      },
      grid: {
        vertLines: {
          style: LineStyle.Dotted,
          color: 'rgba(0, 0, 0, 0.2)'
        },
        horzLines: {
          style: LineStyle.Dotted,
          color: 'rgba(0, 0, 0, 0.2)'
        }
      }
    })
    chart.applyOptions({
      leftPriceScale: { autoScale: true, visible: true, borderColor: 'rgba(0, 0, 0, 0.2)' },
      rightPriceScale: { visible: false },
      timeScale: {
        borderColor: 'rgba(0, 0, 0, 0.2)',
        timeVisible: true,
        secondsVisible: true,
        shiftVisibleRangeOnNewBar: true,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time)
          const year = date.getUTCFullYear()
          const month = date.getUTCMonth() + 1
          const day = date.getUTCDate()
          return year + '/' + month + '/' + day
        }
      },
      crosshair: {
        vertLine: {
          labelVisible: false,
          color: 'rgba(0, 0, 0, 0.4)'
        }
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true
      }
    })
    const resizeFunction = () => {
      chart.resize(chartElement ? chartElement.offsetWidth : 556, 328)
    }
    window.addEventListener('resize', resizeFunction)
    setChart(chart)
    const lineSeries = chart.addAreaSeries({
      lineColor: '#FF4141',
      topColor: 'rgba(254, 240, 238, 1)',
      bottomColor: 'rgba(254, 240, 238, 0)',
      lineWidth: 1,
      priceFormat: {
        type: 'price',
        precision: 2
      }
    })
    setLineSeries(lineSeries)
    return () => window.removeEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (lineSeries) {
      if (currentTab === 'CALL') {
        callChartData && lineSeries.setData(callChartData)
      } else {
        putChartData && lineSeries.setData(putChartData)
      }
    }
    if (chart) {
      chart.timeScale().fitContent()
    }
  }, [lineSeries, chart, currentTab, putChartData, callChartData])

  // const handleMarketPriceChart = useCallback(() => setIsMarketPriceChart(true), [])
  // const handleModalChart = useCallback(() => setIsMarketPriceChart(false), [])

  const optionInformation = useMemo(() => {
    if (!option || !priceCall || !pricePut) return

    const range = {
      cap: tryFormatAmount(option?.priceCap, option?.currency ?? undefined),
      floor: tryFormatAmount(option?.priceFloor, option?.currency ?? undefined)
    }

    const address = currentTab === 'CALL' ? option?.callToken?.address : option?.putToken?.address

    return {
      'Pool ID': optionId || '-',
      [`${currentTab} Token Contract Address`]: address && shortenAddress(address, 6),
      'Option Price Range': `$${range.floor?.toExact().toString()}~$${range.cap?.toExact().toString()}` || '',
      [`${currentTab} Token Issuance`]:
        currentTab === 'CALL'
          ? '$' + callTotalSupply?.toFixed(2).toString()
          : '$' + putTotalSupply?.toFixed(2).toString(),
      'Underlying Assets': `${option.underlying?.symbol}, ${option.currency?.symbol}` || '-',
      [`${currentTab} Token Market Price`]:
        currentTab === 'CALL' ? '$' + priceCall.toSignificant(6) : '$' + pricePut.toSignificant(6)
    }
  }, [optionId, currentTab, option, callTotalSupply, putTotalSupply, priceCall, pricePut])

  return (
    <>
      <NetworkErrorModal />
      <Grid maxWidth={1200} container spacing={20} padding={0}>
        <Grid item xs={12} md={4}>
          <Swap
            optionPrice={optionPrice}
            // handleOptionType={handleOptionType}
            option={option}
            setParentTXHash={handleHash}
            optionType={currentTab}
            setOptionType={setCurrentTab}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <GraphWrapper>
            {graphLoading && <NetworkPendingSpinner paddingTop="0" />}
            <CurrentPrice>
              <TYPE.gray fontSize={16} fontWeight={400}>
                Current price:{' '}
                <span style={{ color: '#252525', marginLeft: '10px' }}>
                  $
                  {currentTab === OptionField.CALL
                    ? priceCall
                      ? priceCall.toSignificant(6)
                      : '-'
                    : pricePut
                    ? pricePut.toSignificant(6)
                    : '-'}
                </span>
              </TYPE.gray>
            </CurrentPrice>
            {/* <ButtonGroup> */}
            {/* <Button isActive={isMarketPriceChart} onClick={handleMarketPriceChart} style={{ display: 'none' }}></Button> */}
            <TYPE.body fontWeight="700" fontSize={24} marginBottom={24}>
              {currentTab} Token
            </TYPE.body>
            {/* <Button isActive={!isMarketPriceChart} onClick={handleModalChart}>
              Price Modeling Prediction
            </Button> */}
            {/* </ButtonGroup> */}

            <Chart id="chart" />
            <Box mt={'24px'}>
              <Typography fontSize={16} fontWeight={600} mb="20px">
                Option Information
              </Typography>
              <Grid container rowSpacing={9}>
                {optionInformation &&
                  Object.keys(optionInformation).map((key, idx) => (
                    <Grid key={idx} item xs={6}>
                      <Typography fontSize={16} lineHeight="auto">
                        <span style={{ opacity: 0.4, marginRight: 4 }}>{key}: </span>
                        {optionInformation[key]}
                      </Typography>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </GraphWrapper>
        </Grid>
      </Grid>
    </>
  )
}
