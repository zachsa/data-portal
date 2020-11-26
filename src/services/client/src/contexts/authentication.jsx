import { useState, useEffect, createContext } from 'react'
import {
  CATALOGUE_CLIENT_AUTH_ID as clientId,
  CATALOGUE_CLIENT_AUTH_REDIRECT_URL as redirectUrl,
  AUTHENTICATION_ENDPOINT as authenticationEndpoint,
  TOKEN_ENDPOINT as tokenEndpoint,
  REQUESTED_SCOPES as requestedScopes,
  LOGOUT_ENDPOINT as logoutEndpoint,
  ENABLE_LOGIN,
} from '../config'
import authClient from '@saeon/pkce-client'

const USE_LOGIN = ENABLE_LOGIN === 'enabled'

const { authenticate, logout, getBearerToken } = authClient({
  clientId,
  redirectUrl,
  authenticationEndpoint,
  tokenEndpoint,
  requestedScopes,
  logoutEndpoint,
})

export const AuthContext = createContext()

export default ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    if (USE_LOGIN) {
      setLoggingIn(true)
      authenticate({ forceLogin: false })
        .then(({ loggedIn }) => {
          setLoggingIn(false)
          setLoggedIn(loggedIn)
        })
        .catch(error => {
          setLoggingIn(false)
          throw error
        })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login: ({ savePath = true } = {}) => {
          if (USE_LOGIN) {
            setLoggingIn(true)
            authenticate({ redirectToCurrentPath: savePath })
              .then(({ loggedIn }) => {
                setLoggingIn(false)
                setLoggedIn(loggedIn)
              })
              .catch(error => {
                setLoggingIn(false)
                throw error
              })
          } else {
            alert('This feature is currently disabled')
          }
        },
        logout: () => {
          setLoggingIn(true)
          logout()
            .then(({ loggedIn }) => {
              setLoggingIn(false)
              setLoggedIn(loggedIn)
            })
            .catch(error => {
              setLoggingIn(false)
              throw error
            })
        },
        getBearerToken,
        loggedIn,
        loggingIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
