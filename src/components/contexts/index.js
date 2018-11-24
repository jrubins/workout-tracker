import { createContext } from 'react'

// Tracks if a user has authenticated and has a valid JWT token.
export const UserContext = createContext({
  jwt: null,
  setJwt: () => {}, // eslint-disable-line no-empty-function
})
