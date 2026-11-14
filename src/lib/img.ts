/** Serve a public image through the Netlify Image CDN at a given width. */
export function img(src: string, width: number) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp`
}
