'use client'

import { useEffect } from 'react'

export function BfcacheGuard() {
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted && !document.cookie.includes('user_info=')) {
        window.location.replace('/login')
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])
  return null
}
