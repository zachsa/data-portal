import { useEffect, useState } from 'react'
import Polygon from 'ol/geom/Polygon'
import Point from 'ol/geom/Point'
import WKT from 'ol/format/WKT'
import { parse } from 'url'
import { OlReact } from '@saeon/ol-react'
import Loading from '../../components/loading'
import { terrestrisBaseMap, createLayer, LayerTypes } from '../../lib/ol/layers'
import { CATALOGUE_API_ADDRESS } from '../../config'
import DialogContent from '@material-ui/core/DialogContent'
import useStyles from './style'
import clsx from 'clsx'

const wkt = new WKT()

const SPATIALDATA_PROXY = `${CATALOGUE_API_ADDRESS}/proxy/saeon-spatialdata`

const EXTENT_PADDING = 3

export default ({ geoLocations, linkedResource, id, title }) => {
  const classes = useStyles()
  const { resourceURL = undefined } = linkedResource
  const [uriInspection, setUriInspection] = useState({ error: undefined, loading: true })
  const { pathname, hostname, port, query } = parse(resourceURL, true)
  const { layers: LAYERS } = query
  const layerId = `${id} - ${LAYERS}`
  const uri = `${SPATIALDATA_PROXY}/${hostname}/${port}${pathname}`

  /**
   * Test if QUERY resource is an easy to use
   * WMS server. If not, then display the
   * linkedResources field instead of a map
   */
  useEffect(() => {
    fetch(`${uri}?request=GetCapabilities`)
      .then(res => res.status)
      .then(status => {
        if (status === 200) {
          setUriInspection({ error: false, loading: false })
        } else {
          setUriInspection({ error: true, loading: false })
        }
      })
  }, [uri])

  if (uriInspection.loading) {
    return <Loading />
  }

  if (uriInspection.error) {
    return (
      <DialogContent>
        <pre className={clsx(classes.errorBlock)}>
          {`Non standard format for WMS resource - cannot render a map. The URL is probably intended for manual inspection (see below)\n\n${JSON.stringify(
            linkedResource,
            null,
            2
          )}`}
        </pre>
      </DialogContent>
    )
  }

  return (
    <OlReact
      viewOptions={{
        smoothExtentConstraint: true,
        showFullExtent: true,
        extent: geoLocations[0].geoLocationBox
          ? new Polygon(wkt.readGeometry(geoLocations[0].geoLocationBox).getCoordinates())
              .getExtent()
              .map((v, i) => ((i === 0) | (i === 1) ? v - EXTENT_PADDING : v + EXTENT_PADDING))
          : geoLocations[0].geoLocationPoint
          ? new Point(wkt.readGeometry(geoLocations[0].geoLocationPoint).getCoordinates())
              .getExtent()
              .map((v, i) => ((i === 0) | (i === 1) ? v - EXTENT_PADDING : v + EXTENT_PADDING))
          : undefined,
      }}
      layers={[
        createLayer({ id: layerId, layerType: LayerTypes.TileWMS, title, uri, LAYERS }),
        terrestrisBaseMap(),
      ]}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
