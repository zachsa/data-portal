import React, { useState, useEffect, useContext, useRef } from 'react'
import { useQuery, gql } from '@apollo/client'
import Header from './header'
import Sidebar from './sidebar'
import Items from './items'
import { UriStateContext } from '../../modules/provider-uri-state'
import { Typography, LinearProgress, Grid, Collapse } from '@material-ui/core'
import { isMobile } from 'react-device-detect'
// import clsx from 'clsx'
// import useStyles from './style'

const DEFAULT_CURSORS = {
  start: undefined,
  end: undefined,
  currentPage: 0,
}

export default ({ hideSidebar = false, disableSidebar = false }) => {
  const [showSidebar, setShowSidebar] = useState(disableSidebar === true ? false : !hideSidebar)
  const ref = useRef()
  const { getUriState } = useContext(UriStateContext)
  const [pageSize, setPageSize] = useState(20)
  const [textSearch, setTextSearch] = useState('')
  const [cursors, setCursors] = useState(DEFAULT_CURSORS)
  // const classes = useStyles()

  const { terms } = getUriState({ splitString: true })
  const { extent } = getUriState({ splitString: false })

  useEffect(() => {
    if (ref.current && terms?.length !== ref.current.length) {
      setCursors(DEFAULT_CURSORS)
    }
    ref.current = terms
  }, [terms, extent])

  const { error, loading, data } = useQuery(
    gql`
      query catalogue(
        $extent: WKT_4326
        $match: String
        $terms: [String!]
        $size: Int
        $before: ID
        $after: ID
      ) {
        catalogue {
          records(
            extent: $extent
            match: $match
            terms: $terms
            size: $size
            before: $before
            after: $after
          ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
            nodes {
              target
            }
          }
        }
      }
    `,
    {
      variables: {
        extent: extent || undefined,
        terms: terms || [],
        match: textSearch || undefined,
        size: pageSize,
        after: cursors.end,
        before: cursors.start,
      },
    }
  )

  // TODO - I think that this is the OLD value of cursors.start prior to state update. Works but should reference the new value
  const results = data?.cursors?.start
    ? data?.catalogue.records.nodes.slice(0).reverse()
    : data?.catalogue.records.nodes || []

  return error ? (
    <Typography>{JSON.stringify(error)}</Typography>
  ) : (
    <Header
      disableSidebar={disableSidebar}
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      cursors={cursors}
      setCursors={setCursors}
      setPageSize={setPageSize}
      pageSize={pageSize}
      loading={loading}
      catalogue={data?.catalogue}
      setTextSearch={setTextSearch}
      textSearch={textSearch}
    >
      {/**
       * TODO: Add toggle sidebar collapse animation
       *
       * Although @material-ui/core adds support for
       * horizontal collapse, the grid item has to be
       * a direct descendant of grid container
       *
       * So i'm not sure how to animate changs to the
       * flex layout
       **/}
      <Grid style={{ height: '100%' }} container direction="row">
        {disableSidebar ? null : isMobile ? (
          <Collapse orientation={'vertical'} in={showSidebar}>
            <Grid item xs={12}>
              <Sidebar />
            </Grid>
          </Collapse>
        ) : showSidebar ? (
          <Grid item md={4}>
            <Sidebar />
          </Grid>
        ) : null}

        <Grid item xs style={{ flexGrow: 1 }}>
          {loading ? (
            <Grid item xs={12} style={{ position: 'relative' }}>
              <LinearProgress style={{ position: 'absolute', left: 0, right: 0 }} />
            </Grid>
          ) : (
            <Items results={results} />
          )}
        </Grid>
      </Grid>
    </Header>
  )
}
