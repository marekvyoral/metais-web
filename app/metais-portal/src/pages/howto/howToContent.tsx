import { initAll } from '@id-sk/frontend/idsk/all'
import { baseWikiUrl } from '@isdd/metais-common/constants'
import { useGetPageRender } from '@isdd/metais-common/hooks/wiki/useGetPageRender'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface HowToContentProps {
    howToEnumType?: string
}
let initializedData = ''

const HowToContent: React.FC<HowToContentProps> = ({ howToEnumType }) => {
    const { data, isError, isLoading, changeUrl } = useGetPageRender(howToEnumType ?? '')
    const idskContentRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const scrollToAnchor: (anchor: string) => void = (anchor) => {
        const elementId = anchor ? (anchor.startsWith('#') ? anchor.substring(1) : anchor) : ''
        const elementToScroll = document.getElementById(elementId)
        if (elementToScroll) {
            elementToScroll.scrollIntoView()
        }
    }

    useEffect(() => {
        if (isError) {
            initializedData = ''
            return
        }

        if (isLoading) {
            return
        }

        setTimeout(() => {
            if (initializedData === data) {
                return
            }
            const scope = idskContentRef.current
            if (scope && data) {
                initializedData = data
                initAll({ scope })
            }
            scrollToAnchor(window.location.hash)
        }, 500)
    }, [data, isLoading, isError])

    return (
        <>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <div ref={idskContentRef} className="wiki">
                    {data && (
                        <div
                            dangerouslySetInnerHTML={{ __html: data }}
                            onClick={(e) => {
                                const target = e.target as HTMLAnchorElement

                                if (target.tagName === 'A') {
                                    const href = target.getAttribute('href') ?? ''
                                    if (href && href.startsWith('#')) {
                                        return
                                    }

                                    const targetUrl = new URL(href, baseWikiUrl)

                                    const isInternalLink = target.getAttribute('internal-link') === 'true'
                                    const isDownloadLink = targetUrl.pathname.startsWith('/download')
                                    const isRelativeLink = new URL(document.baseURI).origin === new URL(href, document.baseURI).origin

                                    if (isDownloadLink) {
                                        target.setAttribute('target', '_blank')
                                        return
                                    }

                                    if (isInternalLink) {
                                        e.preventDefault()
                                        changeUrl(href)
                                        return
                                    }

                                    if (isRelativeLink) {
                                        e.preventDefault()
                                        navigate(href)
                                        return
                                    }

                                    target.setAttribute('target', '_blank')
                                }
                            }}
                        />
                    )}
                </div>
            </QueryFeedback>
        </>
    )
}

export default HowToContent
