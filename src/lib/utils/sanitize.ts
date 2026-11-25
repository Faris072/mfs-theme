const ALLOWED_HTML_TAGS = new Set([
  'p',
  'br',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'del',
  'ul',
  'ol',
  'li',
  'span',
  'div',
  'blockquote',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'a'
])

const DROP_CONTENT_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'svg',
  'math',
  'noscript',
  'template'
])

export function sanitizeHref(url?: string): string | undefined {
  if (!url || typeof url !== 'string') return undefined

  const cleaned = url.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  if (!cleaned) return undefined

  const normalized = cleaned.replace(/[\u0000-\u0020\u007f]+/g, '').toLowerCase()
  if (!normalized) return undefined

  // Reject protocol-relative URLs
  if (normalized.startsWith('//') || normalized.startsWith('/\\')) {
    return undefined
  }

  // Allow safe relative paths and hash links
  if (
    normalized.startsWith('/') ||
    normalized.startsWith('#') ||
    normalized.startsWith('./') ||
    normalized.startsWith('../')
  ) {
    return cleaned
  }

  // Allow explicit safe schemes only
  if (/^(https?:|mailto:|tel:)/.test(normalized)) {
    return cleaned
  }

  return undefined
}

function sanitizeNode(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? '')]
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return []
  }

  const el = node as Element
  const tag = el.tagName.toLowerCase()

  if (DROP_CONTENT_TAGS.has(tag)) {
    return []
  }

  const sanitizedChildren: Node[] = []
  for (const child of Array.from(el.childNodes)) {
    sanitizedChildren.push(...sanitizeNode(child, doc))
  }

  if (!ALLOWED_HTML_TAGS.has(tag)) {
    return sanitizedChildren
  }

  const cleanEl = doc.createElement(tag)
  if (tag === 'a') {
    const safeHref = sanitizeHref(el.getAttribute('href') ?? undefined)
    if (safeHref) {
      cleanEl.setAttribute('href', safeHref)
      cleanEl.setAttribute('rel', 'noopener noreferrer')
    }
  }

  for (const child of sanitizedChildren) {
    cleanEl.appendChild(child)
  }

  return [cleanEl]
}

export function sanitizeHtmlToNodes(html: string): Node[] {
  if (typeof DOMParser === 'undefined') return []

  const doc = new DOMParser().parseFromString(html || '', 'text/html')
  const nodes: Node[] = []
  for (const child of Array.from(doc.body.childNodes)) {
    nodes.push(...sanitizeNode(child, doc))
  }
  return nodes
}

export function sanitizeHtml(html: string): string {
  if (typeof document === 'undefined' || typeof DOMParser === 'undefined') return ''

  const container = document.createElement('div')
  container.append(...sanitizeHtmlToNodes(html))
  return container.innerHTML
}
