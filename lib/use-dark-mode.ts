import useDarkModeImpl from '@fisch0920/use-dark-mode'

export function useDarkMode() {
  const darkMode = useDarkModeImpl(true, {
    classNameDark: 'dark-mode',
    classNameLight: 'light-mode',
    storageKey: 'site-theme'
  })

  return {
    isDarkMode: darkMode.value,
    toggleDarkMode: darkMode.toggle
  }
}
