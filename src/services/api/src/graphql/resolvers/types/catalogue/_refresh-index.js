import fetch from 'node-fetch'
import hash from 'object-hash'
import { Catalogue } from '../../../../../../../packages/catalogue-search/src/catalogue-search/index.js'
import {
  ES_INDEX,
  ES_INTEGRATION_BATCH_SIZE,
  ES_HOST_ADDRESS,
  HTTP_PROXY,
} from '../../../../config.js'

/**
 * TODO
 * The ES source will need to be updated for this integration
 *
 * TODO
 * An additional proxy rule for the new elasticsearch instance
 */
const oldCatalogue = new Catalogue({
  dslAddress: `${HTTP_PROXY}/proxy/saeon-elk`,
  index: 'saeon-odp-4-2',
  httpClient: fetch,
})

const makeIterator = async (cursor = null) => {
  const dsl = {
    size: ES_INTEGRATION_BATCH_SIZE,
    query: {
      match_all: {},
    },
    sort: [{ 'id.raw': 'asc' }],
  }

  if (cursor) {
    dsl.search_after = [cursor]
  }

  const response = await oldCatalogue.query(dsl)
  const { hits } = response.hits

  return {
    next: () => makeIterator(hits[hits.length - 1]._id),
    values: hits,
    done: Boolean(!hits.length),
  }
}

/**
 * Even with only 2 000 docs, the default content-length
 * allowed for ES POST requests is exceeded. So it's best
 * to batch bulk inserts into ES
 *
 * Source docs don't have ID fields, so these are created
 * by hashing the doc.identifier object. If there are
 * duplicates of this... file a ticket with the curators
 */
export default async () => {
  const result = {
    updated: 0,
    created: 0,
    error: false,
  }

  try {
    let iterator = await makeIterator()
    while (!iterator.done) {
      const response = await fetch(`${ES_HOST_ADDRESS}/${ES_INDEX}/_bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-ndjson',
        },
        body: iterator.values
          .map(({ _source }) =>
            Object.assign(
              Object.fromEntries(
                Object.entries(_source.metadata_json).filter(([k]) => k !== 'originalMetadata')
              ),
              { id: hash(_source.metadata_json.identifier) }
            )
          )
          .map(doc => `{ "index": {"_id": "${doc.id}"} }\n${JSON.stringify(doc)}\n`)
          .join(''),
      })
        .then(res => res.json())
        .catch(error => {
          throw new Error(`Unable to refresh ES index :: ${error.message}`)
        })

      console.log(`Processed ${response.items.length} docs into the ${ES_INDEX} index`)
      response.items.forEach(({ index }) => (result[index.result] += 1))

      iterator = await iterator.next()
    }
  } catch (error) {
    result.error = error.message
  }

  return result
}
