import * as React from 'react'

import * as config from '@/lib/config'
import { GitHubIcon } from '@/lib/icons/github'
import { LinkedInIcon } from '@/lib/icons/linkedin'
import { MoonIcon } from '@/lib/icons/moon'
import { SunIcon } from '@/lib/icons/sun'
import { TwitterIcon } from '@/lib/icons/twitter'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

export function FooterImpl() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const currentYear = new Date().getFullYear()

  const onToggleDarkMode = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      {/* Üst satır: İletişim */}
      <div className={styles.contact}>
        İletişim:{' '}
        <a className={styles.email} href='mailto:erdemilker@hotmail.com'>
          erdemilker@hotmail.com
        </a>
      </div>

      {/* Orta satır: Sosyal ikonlar + Dark mode */}
      <div className={styles.centerRow}>
        <div className={styles.social}>
          {config.twitter && (
            <a
              className={styles.twitter}
              href={`https://x.com/${config.twitter}`}
              title={`X @${config.twitter}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`X @${config.twitter}`}
            >
              <TwitterIcon />
            </a>
          )}

          {config.github && (
            <a
              className={styles.github}
              href={`https://github.com/${config.github}`}
              title={`GitHub @${config.github}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`GitHub @${config.github}`}
            >
              <GitHubIcon />
            </a>
          )}

          {config.linkedin && (
            <a
              className={styles.linkedin}
              href={`https://www.linkedin.com/in/${config.linkedin}`}
              title={`LinkedIn ${config.author}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`LinkedIn ${config.author}`}
            >
              <LinkedInIcon />
            </a>
          )}
        </div>

        <div className={styles.settings}>
          {hasMounted && (
            <a
              className={styles.toggleDarkMode}
              href='#'
              role='button'
              onClick={onToggleDarkMode}
              title='Toggle dark mode'
              aria-label='Toggle dark mode'
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </a>
          )}
        </div>
      </div>

      {/* Alt satır: İmza */}
      <div className={styles.signature}>
        © {currentYear} {config.author} — Karanlıkta Yazıldı.
      </div>

      {/* Eski copyright satırı kaldırıldı */}
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
