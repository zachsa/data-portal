import React, { useState } from 'react'
import { Switch, withRouter } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Typography, Menu } from '@material-ui/core'
import {
  Menu as MenuIcon,
  GitHub as GitHubIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  List as ListIcon,
} from '@material-ui/icons'
import NavItem from './nav-item'
import packageJson from '../../../package.json'
import { SOURCE_CODE_URI } from '../../config'

const Layout = ({ children }) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const closeMenu = () => setMenuAnchor(null)

  return (
    <>
      <AppBar variant="outlined" position="static">
        <Toolbar disableGutters={false} variant="dense">
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            style={{ padding: 0 }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            onClick={closeMenu}
          >
            {/* Home page */}
            <NavItem label={'Home'} icon={<HomeIcon />} to="/" />

            {/* About page */}
            <NavItem label={'About'} icon={<InfoIcon />} to="/about" />

            {/* Search page */}
            <NavItem label={'Search'} icon={<SearchIcon />} to="/search" />

            {/* Search results page */}
            <NavItem label={'Search results'} icon={<ListIcon />} to="/search-results" />

            {/* Source code link */}
            <NavItem label={'Source Code'} icon={<GitHubIcon />} href={SOURCE_CODE_URI} />
          </Menu>

          {/* Title */}
          <Typography style={{ padding: '10px' }} display="block" variant="body2">
            SAEON Atlas {packageJson.version}
          </Typography>

          {/* GitHub link */}
          <IconButton
            component={'a'}
            href={SOURCE_CODE_URI}
            style={{ marginLeft: 'auto' }}
            rel={'noopener noreferrer'}
            target={'_blank'}
            color="inherit"
            size="small"
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Application routes */}
      <Switch key={location.pathname || '/'}>{children}</Switch>

      {/* Footer */}
      <AppBar variant="outlined" position="fixed" style={{ bottom: 0, top: 'auto', zIndex: 1 }}>
        <Toolbar style={{ justifyContent: 'center', minHeight: '24px' }} disableGutters={false}>
          <Typography variant="caption">&copy; SAEON 2020</Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default withRouter(Layout)
