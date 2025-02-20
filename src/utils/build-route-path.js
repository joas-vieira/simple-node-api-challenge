export function buildRoutePath(url) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParameters = url.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParameters}(?<query>\\?(.*))?$`)

  return pathRegex
}