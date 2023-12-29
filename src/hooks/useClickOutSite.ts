import { RefObject } from 'react'

type Handler = (event: MouseEvent) => void

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
): void {
    window.addEventListener('click',(event)=>{
        const el = ref?.current

        // Do nothing if clicking ref's element or descendent elements
        if (!el || el.contains(event.target as Node)) {
          return
        }
    
        handler(event)
    })
}