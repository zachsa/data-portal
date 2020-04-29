import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import MenuContext from './context'

const menuContainerEl = document.getElementById('menu-portal')

export default class extends PureComponent {
  state = { menus: [] }

  addMenu = ({ id, Component, zIndex = 2, norender = false, ...props }) =>
    this.setState({
      menus: [...this.state.menus, { id, zIndex, Component, norender, ...props }],
    })

  removeMenu = (removeId) =>
    this.setState({
      menus: [...this.state.menus].filter(({ id }) => id !== removeId),
    })

  getMenuById = (id) => this.state.menus.find((item) => item.id === id)

  setActiveMenu = (id) => {
    const newMenus = [...this.state.menus].map((m) => {
      if (m.id === id) {
        return Object.assign({ ...m }, { zIndex: this.getActiveMenuZIndex() })
      } else {
        return m
      }
    })
    this.setState({
      menus: newMenus,
    })
  }

  getActiveMenuZIndex = () => {
    const zIndices = this.state.menus.map(({ zIndex }) => (zIndex || 1) + 1)
    const zIndex = zIndices.length ? Math.max(...zIndices) : 2
    return zIndex
  }

  getDefaultPosition = () => {
    const l = this.state.menus.length
    const offset = (l - 1) * 25
    return { x: 100 + offset, y: 75 + offset }
  }

  render() {
    const {
      state,
      props,
      removeMenu,
      addMenu,
      getMenuById,
      setActiveMenu,
      getActiveMenuZIndex,
      getDefaultPosition,
    } = this
    const { children } = props
    const { menus } = state

    return (
      <MenuContext.Provider
        value={{
          getMenuById,
          menus,
          setActiveMenu,
          addMenu,
          removeMenu,
          getActiveMenuZIndex,
          menuContainerEl,
          getDefaultPosition,
        }}
      >
        {/* Render menus into a top level portal */}
        {menus
          .filter(({ Component, norender = false }) => Component && !norender)
          .map((item, i) => {
            return createPortal(<item.Component {...item} key={i} />, menuContainerEl)
          })}

        {/* Render children */}
        {children}
      </MenuContext.Provider>
    )
  }
}
