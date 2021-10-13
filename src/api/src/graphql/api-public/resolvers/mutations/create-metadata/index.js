import { ObjectId } from 'mongodb'
import fetch from 'node-fetch'
import { ODP_API, ELASTICSEARCH_METADATA_INDEX } from '../../../../../config/index.js'
import { v4 as UUIDv4 } from 'uuid'
import processRecordsIntoElasticsearch from '../../../../../integrations/metadata/process-records/index.js'
import mapToMetadata from '../../../../../lib/process-metadata/map-to-metadata.js'

export default async (self, { input, numberOfRecords = 1, institution }, ctx) => {
  const { id: currentUserId } = ctx.user.info(ctx)
  const { findUsers } = ctx.mongo.dataFinders
  const user = (await findUsers({ _id: ObjectId(currentUserId) }))[0]
  const { token_type, access_token } = user.tokenSet

  /**
   * Set timeout to 20 minutes
   * (in case user is creating many records)
   */
  ctx.request.socket.setTimeout(20 * 60 * 1000)

  /**
   * The ODP allows for creating records
   * one at a time. Each new record is its
   * own API request
   */
  const result = await Promise.all(
    [...Array(numberOfRecords)].map(
      () =>
        new Promise((resolve, reject) =>
          fetch(`${ODP_API}/${institution}/metadata/`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              accept: 'application/json',
              authorization: [token_type, access_token].join(' '),
            },
            body: JSON.stringify({
              sid: UUIDv4(),
              ...input,
            }),
          })
            .then(res => res.text())
            .then(txt => {
              try {
                return JSON.parse(txt)
              } catch (error) {
                console.error('Unable to parse ODP response', txt, error)
                throw error
              }
            })
            .then(json => {
              if (json.detail) {
                throw new Error(`ERROR creating metadata records: ${json.detail}`)
              } else {
                return resolve(json)
              }
            })
            .catch(error => reject(error))
        )
    )
  )

  /**
   * Process the ODP results into
   * the Elasticsearch index, then
   * return the recently added docs
   */
  return mapToMetadata(
    await ctx.elastic.query({
      index: ELASTICSEARCH_METADATA_INDEX,
      body: {
        size: 20,
        query: {
          ids: {
            values: (
              await processRecordsIntoElasticsearch(result, null, 2)
            ).body.items.map(({ index: { _id } }) => _id),
          },
        },
      },
    })
  )
}
