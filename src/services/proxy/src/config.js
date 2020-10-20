import dotenv from 'dotenv'
dotenv.config()

// Repository information
export const LATEST_COMMIT = process.env.LATEST_COMMIT || undefined

// Anyproxy configuration
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8001
export const ENABLE_WEB_INTERFACE =
  process.env.ENABLE_WEB_INTERFACE?.toLowerCase() === 'false' ? false : true
export const WEB_INTERFACE_PORT = process.env.WEB_INTERFACE_PORT
  ? parseInt(process.env.WEB_INTERFACE_PORT, 10)
  : 8002
export const THROTTLE = process.env.THROTTLE ? parseInt(process.env.THROTTLE, 10) : 10000

// User configuration
export const ELASTICSEARCH_PROXY = process.env.ELASTICSEARCH_PROXY || 'http://localhost:9200'
export const SAEON_SPATIALDATA_PROXY = 'https://spatialdata.saeon.ac.za'
export const CSIR_ESRI_PROXY = 'https://pta-gis-2-web1.csir.co.za/server2/rest/services'
export const HST_ESRI_PROXY = 'https://gisportal.saeon.ac.za/server/rest/services'
