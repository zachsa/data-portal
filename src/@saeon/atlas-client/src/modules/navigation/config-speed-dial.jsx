import React, { Component } from 'react'
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import { Settings as SettingsIcon, BeachAccess } from '@material-ui/icons'
import { DragMenu } from '../../components'

export default class extends Component {
  state = {
    open: false,
    todoOpen: false
  }

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate() {
    return true
  }

  render() {
    const { open, todoOpen } = this.state
    const { proxy } = this.props

    return (
      <>
        <SpeedDial
          style={{ position: 'absolute', left: 20, top: 197 }}
          ariaLabel="Config speed dial menu"
          icon={<SettingsIcon />}
          onClose={() => this.setState({ open: false })}
          onOpen={() => this.setState({ open: true })}
          open={open}
          direction={'right'}
        >
          <SpeedDialAction
            icon={<BeachAccess color={todoOpen ? 'primary' : 'secondary'} />}
            tooltipTitle={'Layers'}
            onClick={() => this.setState({ open: false, todoOpen: !todoOpen })}
          />
        </SpeedDial>
        <DragMenu
          title="Config item example"
          active={todoOpen}
          close={() => this.setState({ todoOpen: false })}
          proxy={proxy}
        >
          Content area
        </DragMenu>
      </>
    )
  }
}
