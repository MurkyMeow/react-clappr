import { Container } from 'clappr'
import { useEffect } from 'react'

/**
 * remove Clappr styles that spread to all the elements inside the player
 * and have too high specificity to override them without !important
 */
export function useResetStyles(container: Container | undefined) {
  useEffect(() => {
    if (!container) return

    const styles = Array.from(document.head.querySelectorAll('style'))

    const annoyingStyle = styles.find((style) =>
      style.textContent?.includes('[data-player] div, [data-player] span')
    )

    if (annoyingStyle) {
      annoyingStyle.remove()
    }

    container.$el.css({
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    })

    container.$el.find('[data-html5-video]').css({
      display: 'block',
      width: '100%',
      height: '100%',
    })
  }, [container])
}
