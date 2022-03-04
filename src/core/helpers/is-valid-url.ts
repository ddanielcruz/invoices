import { URL } from 'url'

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
