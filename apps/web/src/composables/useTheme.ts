import { Dark, colors, setCssVar } from 'quasar'
import { ScreenMode } from 'src/types'

export function useTheme() {

  function get(): ScreenMode {
    return Dark.mode === true ? 'dark' : Dark.mode === false ? 'light' : 'auto'
  }

  function set(value: ScreenMode) {
    const mode = value === 'auto' ? 'auto' : value === 'dark'
    Dark.set(mode)
    if (Dark.isActive) {
      setDarkColors()
    } else {
      setLightColors()
    }
  }

  function setDarkColors() {
    const primary = '#3b88d4'
    const secondary = '#61B0FF'
    const accent = '#D49B3B'
    const foreground = '#bcc5cf'
    const background = 'rgb(31, 33, 36)' // background of chrome

    setCssVar('primary', primary)
    setCssVar('secondary', secondary)
    setCssVar('accent', accent)
    setCssVar('foreground', foreground)
    setCssVar('background', background)

    // On Safari, without changing alpha the color will be wrong, looking closer to background
    setCssVar('selection', colors.changeAlpha(colors.lighten(primary, -50), 0.99))
    setCssVar('border', colors.lighten(background, 20))
    setCssVar('scrollbar-thumb', colors.lighten(background, 10))
    setCssVar('background-05', colors.lighten(background, 5))
    setCssVar('background-10', colors.lighten(background, 10))
    setCssVar('scrollbar-thumb-hover', colors.lighten(background, 20))
    setCssVar('alternate', colors.lighten(primary, 20))
    setCssVar('foreground-dimmed', colors.changeAlpha(foreground, 0.7))
  }

  function setLightColors() {
    const primary = '#1976D2'
    const secondary = '#1976D2'
    // const secondary1 = '#0A5CAD'
    const accent = '#D18C19'
    const foreground = '#000000'
    const background = '#ffffff'
    setCssVar('primary', primary)
    setCssVar('secondary', secondary)
    setCssVar('accent', accent)
    setCssVar('foreground', foreground)
    setCssVar('background', background)
    // On Safari, without changing alpha the color will be wrong, looking closer to background
    setCssVar('selection', colors.changeAlpha(colors.lighten(primary, 85), 0.99))
    setCssVar('border', colors.lighten(background, -20))
    setCssVar('scrollbar-thumb', colors.lighten(background, -15))
    setCssVar('background-05', colors.lighten(background, -5))
    setCssVar('background-10', colors.lighten(background, -10))
    setCssVar('scrollbar-thumb-hover', colors.lighten(background, -30))
    setCssVar('alternate', colors.lighten(primary, 20))
    setCssVar('foreground-dimmed', colors.changeAlpha(foreground, 0.7))
  }

  return { get, set }
}
