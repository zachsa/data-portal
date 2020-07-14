import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Typography } from '@material-ui/core'
import Layout from './_layout'

export default ({ id }) => {
  const { loading, error, data } = useQuery(
    gql`
      query catalogue($id: String) {
        catalogue {
          records(id: $id) {
            ... on CatalogueRecordConnection {
              nodes {
                ... on CatalogueRecord {
                  target
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: { id },
    }
  )

  const waitMsg = error ? error.message : loading ? 'Loading' : null
  const record = data?.catalogue?.records?.nodes?.[0]?.target?._source?.metadata_json
  return waitMsg ? (
    <Typography variant="overline" style={{ margin: 10, padding: 10 }}>
      {waitMsg}
    </Typography>
  ) : (
    <Layout json={record} id={id} />
  )
}
