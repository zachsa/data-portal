import { Tile as TileLayer } from 'ol/layer'
import { XYZ } from 'ol/source'
import { PROXY_ADDRESS } from '../../../config'

const URL = `${PROXY_ADDRESS}/ahocevar/geoserver/wms`

export const esriBasemap = () =>
  new TileLayer({
    title: 'ESRI Basemap',
    id: 'esribasemap',
    visible: true,
    source: new XYZ({
      url:
        'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    }),
  })
