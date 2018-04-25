/**
 * Returns the name of the app environment.
 *
 * @returns {String}
 */
export function getAppEnvironment() {
  return process.env.APP_ENV
}

/**
 * Returns if we're currently in development or not.
 *
 * @returns {Boolean}
 */
export function isDebug() {
  return process.env.DEBUG
}

/**
 * Returns if we're currently in development or not.
 *
 * @returns {Boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

/**
 * Returns if we're currently in local or not.
 *
 * @returns {Boolean}
 */
export function isLocal() {
  return getAppEnvironment() === 'local'
}

/**
 * Returns if we're currently in production or not.
 *
 * @returns {Boolean}
 */
export function isProduction() {
  return getAppEnvironment() === 'production'
}

/**
 * Returns if we're currently in testing or not.
 *
 * @returns {Boolean}
 */
export function isTest() {
  return process.env.NODE_ENV === 'test'
}
