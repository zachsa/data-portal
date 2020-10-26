import { useContext } from 'react'
import { Fade, CircularProgress } from '@material-ui/core'
import { GlobalContext } from '../../contexts/global'
import Link from '../link'
import { useEffect } from 'react'
import TabPanel from './_panel'
import { gql, useMutation } from '@apollo/client'
import { getShareLink } from '../../hooks'
import packageJson from '../../../package.json'

/**
 * Dialogue contents of the share dialogue
 * This component will be mounted AFTER the
 * dialogue is opened. The useEffect hook will
 * fire every time the dialogue is opened
 */
export default ({ tabIndex, state = undefined, params = {} }) => {
  const { uri: shareLink, params: includeParams } = getShareLink()
  const isAtlasPage = window.location.pathname.includes('atlas')

  const { global } = useContext(GlobalContext)
  const [persistSearchState, { loading, error, data }] = useMutation(gql`
    mutation($state: JSON!, $createdBy: String!) {
      browserClient {
        id
        ${isAtlasPage ? 'createAtlas' : 'persistSearchState'}(state: $state, createdBy: $createdBy)
      }
    }
  `)

  useEffect(() => {
    if (!isAtlasPage) {
      persistSearchState({
        variables: {
          createdBy: `${packageJson.name} v${packageJson.version}`,
          state: state || global,
        },
      })
    }
  }, [isAtlasPage, global, persistSearchState, state])

  const id = data?.browserClient.persistSearchState || undefined

  const uri = isAtlasPage
    ? shareLink
    : `${shareLink}${
        includeParams
          ? `${shareLink.includes('?') ? '&' : '?'}search=${id}&${Object.entries(params)
              .map(([param, val]) => `${param}=${val}`)
              .join('&')}`
          : ''
      }`
        // Remove trailing ampersand
        .split('&')
        .filter(_ => _)
        .join('&')

  return error ? (
    'Error'
  ) : loading ? (
    <Fade key="loading" in={loading}>
      <div
        style={{
          margin: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </div>
    </Fade>
  ) : (
    <Fade in={Boolean(data || isAtlasPage)} key="data">
      <div>
        <TabPanel value={tabIndex} index={0}>
          <Link uri={uri} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {`<iframe width="100%" height="100%" src="${uri}" frameborder="0" allowfullscreen></iframe>`}
        </TabPanel>
      </div>
    </Fade>
  )
}
