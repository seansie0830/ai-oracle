import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * Composable for rendering markdown with security
 * @returns {Object} Markdown utilities
 */
export function useMarkdown() {
    // Configure marked options
    marked.setOptions({
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // Convert line breaks to <br>
        headerIds: true, // Add IDs to headers
        mangle: false, // Don't mangle email addresses
    })

    // Custom renderer for better styling control
    const renderer = new marked.Renderer()

    // Customize code blocks to add language class
    renderer.code = (code, language) => {
        const validLang = language || 'plaintext'
        return `<pre><code class="language-${validLang}">${code}</code></pre>`
    }

    // Customize inline code
    renderer.codespan = (text) => {
        return `<code class="inline-code">${text}</code>`
    }

    // Customize links to open in new tab and add security
    renderer.link = (href, title, text) => {
        const titleAttr = title ? ` title="${title}"` : ''
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
    }

    marked.use({ renderer })

    /**
     * Render markdown to HTML safely
     * @param {string} markdown - Markdown text to render
     * @returns {string} Sanitized HTML
     */
    const renderMarkdown = (markdown) => {
        if (!markdown) return ''

        try {
            // Convert markdown to HTML
            const rawHtml = marked.parse(markdown)

            // Sanitize HTML to prevent XSS attacks
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'em', 'u', 's', 'del',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'ul', 'ol', 'li',
                    'blockquote', 'pre', 'code',
                    'a', 'img',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'hr', 'span', 'div'
                ],
                ALLOWED_ATTR: [
                    'href', 'title', 'target', 'rel',
                    'src', 'alt', 'width', 'height',
                    'class', 'id'
                ],
                ALLOW_DATA_ATTR: false,
            })

            return cleanHtml
        } catch (error) {
            console.error('Error rendering markdown:', error)
            return markdown // Return original text on error
        }
    }

    return {
        renderMarkdown
    }
}
