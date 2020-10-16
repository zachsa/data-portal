import { useState, useContext } from 'react';
import {
  Typography,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Collapse,
  Fade,
  Card,
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons'
import { OlReact, MapProxy } from '@saeon/ol-react'
import { terrestrisBaseMap } from '../../../../../../lib/ol'
import FilterControl from './filter-control'
import useStyles from '../style'
import clsx from 'clsx'
import { GlobalContext } from '../../../../../../contexts/global'

export default ({ title }) => {
  const { global } = useContext(GlobalContext)
  const [collapsed, setCollapsed] = useState(!global?.extent)
  const classes = useStyles()
  const theme = useTheme()

  return (
    <>
      <AppBar
        position="relative"
        variant="outlined"
        className={clsx(classes.appbar)}
        style={{ borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0` }}
      >
        <Toolbar className={clsx(classes.toolbar)} variant="regular">
          <Typography
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: 'pointer' }}
            variant="overline"
            noWrap
          >
            {title}
          </Typography>

          <div style={{ marginLeft: 'auto' }}>
            {/* Icon */}
            <IconButton
              aria-label="Collapse filter"
              onClick={() => setCollapsed(!collapsed)}
              color="inherit"
              size="small"
            >
              {collapsed ? (
                <Fade key={1} timeout={750} in={collapsed}>
                  <ExpandMoreIcon />
                </Fade>
              ) : (
                <Fade key={2} timeout={750} in={!collapsed}>
                  <ExpandLessIcon />
                </Fade>
              )}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Collapse style={{ width: '100%' }} key="result-list-collapse" in={!collapsed}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Card>
              <div style={{ position: 'relative' }}>
                <OlReact
                  viewOptions={{
                    center: [26, -25],
                    zoom: 4,
                  }}
                  layers={[terrestrisBaseMap()]}
                  style={{ height: '300px' }}
                >
                  {({ map }) => {
                    return (
                      <MapProxy map={map}>
                        {({ proxy }) => <FilterControl proxy={proxy} />}
                      </MapProxy>
                    )
                  }}
                </OlReact>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}
