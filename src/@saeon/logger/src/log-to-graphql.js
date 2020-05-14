import DataLoader from './_data-loader'
import { execute, toPromise } from '@apollo/client'

const createArrayFromLength = (l) => {
  const arr = []
  for (let i = 0; i < l; i++) {
    arr.push(false)
  }
  return arr
}

export default ({ link, query }) => {
  const logBatch = (browserEvents) =>
    // TODO: Better rejection handling required
    // eslint-disable-next-line no-unused-vars
    new Promise((resolve, reject) => {
      toPromise(
        execute(link, {
          query,
          variables: {
            input: browserEvents,
          },
        })
      )
        .then((json) => resolve(json))
        .catch((error) => {
          console.error('logToGraphQL failed', error)
          resolve(createArrayFromLength(browserEvents.length))
        })
    })

  const loader = new DataLoader(logBatch)
  return (browserEvent) => loader.load(browserEvent)
}
