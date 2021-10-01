import { ELASTICSEARCH_ADDRESS, ELASTICSEARCH_CATALOGUE_INDEX as index } from '../config/index.js'
import { Client as ElasticClient } from '@elastic/elasticsearch'
import setupTemplates from './setup-templates/index.js'

export const client = new ElasticClient({ node: ELASTICSEARCH_ADDRESS })

export const get = async id => await client.get({ index, id }).then(res => res.body)

export const update = async (id, body) =>
  client.update({
    id,
    index,
    body,
  })

export const query = async dsl => {
  if (!dsl) {
    throw new Error(`DSL object is required to query the Elasticsearch instance`)
  } else {
    dsl = typeof dsl === 'string' ? JSON.parse(dsl) : dsl
  }

  try {
    return await client.search({
      index,
      body: dsl,
    })
  } catch (error) {
    throw new Error(`Elasticsearch query failed with DSL body ${JSON.stringify(dsl)}. ${error}`)
  }
}

setupTemplates(client)
  .then(res => console.info('Elasticsearch templates configured', res))
  .catch(error => {
    console.error('Unable to setup Elasticsearch templates', error)
    process.exit(1)
  })
