import { isDebug, isDevelopment, isProduction, isTest } from '../environment'

/**
 * The logging instance.
 *
 * @type {?Object}
 */
const logger = console

/**
 * Outputs a debug message.
 *
 * @param {...String} rest
 */
export function debug(...rest) {
  if (isDebug() && !isTest()) {
    logger.debug(...rest)
  }
}

/**
 * Outputs an error message.
 *
 * @param {...String} rest
 */
export function error(...rest) {
  if (isTest()) {
    return
  }

  logger.error(...rest)
}

/**
 * Outputs a grouped info message.
 *
 * @param {String} label
 * @param {Boolean} isCollapsed
 * @param {...String} rest
 */
export function group(label, isCollapsed, ...rest) {
  if (isDevelopment() && !isTest()) {
    if (isCollapsed) {
      logger.groupCollapsed(label)
    } else {
      logger.group(label)
    }

    logger.info(...rest)
    logger.groupEnd()
  }
}

/**
 * Outputs an info message.
 *
 * @param {...String} rest
 */
export function info(...rest) {
  if (isDevelopment() && !isTest()) {
    logger.info(...rest)
  }
}

/**
 * Outputs an warning message.
 *
 * @param {...String} rest
 */
export function warn(...rest) {
  if (!isProduction()) {
    logger.warn(...rest)
  }
}
