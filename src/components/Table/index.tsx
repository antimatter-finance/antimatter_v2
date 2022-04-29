import React from 'react'
import styled from 'styled-components'
import { TableContainer, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import useMediaWidth from 'hooks/useMediaWidth'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { TYPE } from 'theme'
export * from './UserTransactionTable'

// interface StyleProps {
//   isHeaderGray?: boolean
// }

const Profile = styled.div`
  display: flex;
  align-items: center;
`

export const TableProfileImg = styled.div<{ url?: string }>`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background: #000000 ${({ url }) => (url ? `url(${url})` : '')};
`

export function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <TableProfileImg url={url} />
      {name}
    </Profile>
  )
}

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'table',
    borderRadius: '40px',
    '& .MuiTableCell-root': {
      fontSize: '16px',
      borderBottom: 'none',
      padding: '14px 20px',
      '& svg': {
        marginRight: 8
      },
      '&:first-child': {
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16
      },
      '&:last-child': {
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16
      }
    },
    '& table': {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px'
    }
  },
  tableHeader: {
    borderRadius: 8,
    overflow: 'hidden',

    '& .MuiTableCell-root': {
      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif!important',
      fontSize: '12px',
      whiteSpace: 'pre',
      lineHeight: '12px',
      background: 'rgba(255, 255, 255, 0.08)',
      padding: '14px 20px',
      color: 'rgba(0, 0, 0, 1)',
      opacity: 0.5,
      borderBottom: 'none',
      '& .MuiTableSortLabel-root': {
        fontWeight: 400,
        opacity: 0.5
      },
      '&:first-of-type': {
        paddingLeft: 20,
        borderTopLeftRadius: 8
      },
      '&:last-child': {
        paddingRight: 20,
        borderTopRightRadius: 8
      }
    }
  },
  tableRow: {
    backgroundColor: '#F2F5FA',
    borderRadius: '16px',
    overflow: 'hidden',
    height: 80,
    '&:hover': {
      backgroundColor: '#E2E7F0'
    },
    '& .MuiTableCell-root': {
      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif!important',
      color: '#000000'
    },
    '&:last-child': {
      border: 'none',
      borderRadius: '16px'
    }
  },
  longTitle: {
    [theme.breakpoints.down('sm')]: {
      whiteSpace: 'pre-wrap'
    }
  }
}))

const Card = styled.div`
  background-color: #f2f5fa;
  border-radius: 16px;
  padding: 24px;
  > div {
    width: 100%;
  }
`

const CardRow = styled(RowBetween)`
  grid-template-columns: auto 100%;
  > div:first-child {
    white-space: pre-wrap;
  }
  > div:last-child {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`

export default function Table({
  header,
  rows,
  rowsComponent,
  isHeaderGray
}: {
  header: string[]
  rows?: (string | number | JSX.Element)[][]
  rowsComponent?: JSX.Element[]
  isHeaderGray?: boolean
}) {
  const match = useMediaWidth('upToSmall')
  const classes = useStyles({ isHeaderGray })
  return (
    <>
      {match ? (
        <AutoColumn gap="20px" style={{ marginTop: 20 }}>
          {rows &&
            rows.map((data, index) => (
              <Card key={index}>
                <AutoColumn gap="16px">
                  {header.map((headerString, index) => (
                    <CardRow key={index}>
                      <TYPE.darkGray className={classes.longTitle}>{headerString}</TYPE.darkGray>
                      <TYPE.body> {data[index] ?? null}</TYPE.body>
                    </CardRow>
                  ))}
                </AutoColumn>
              </Card>
            ))}
        </AutoColumn>
      ) : (
        <TableContainer className={classes.root}>
          <table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                {header.map((string, idx) => (
                  <TableCell key={idx}>{string}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows &&
                rows.map((row, idx) => (
                  <TableRow key={row[0].toString() + idx} className={classes.tableRow}>
                    {row.map((data, idx) => (
                      <TableCell key={idx}>{data}</TableCell>
                    ))}
                  </TableRow>
                ))}
              {rowsComponent}
            </TableBody>
          </table>
        </TableContainer>
      )}
    </>
  )
}

export function Row({ row }: { row: (string | number | JSX.Element)[] }) {
  const classes = useStyles()
  return (
    <TableRow className={classes.tableRow}>
      {row.map((data, idx) => (
        <TableCell key={idx}>{data}</TableCell>
      ))}
    </TableRow>
  )
}
