import { initAll } from '@id-sk/frontend/idsk/all'
import { baseWikiUrl } from '@isdd/metais-common/constants'
import { useGetPageRender } from '@isdd/metais-common/hooks/wiki/useGetPageRender'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useRef, useEffect } from 'react'

export interface HowToContentProps {
    howToEnumType?: string
}
let initializedData = ''

const HowToContent: React.FC<HowToContentProps> = ({ howToEnumType }) => {
    const { data, isError, isLoading, changeUrl } = useGetPageRender(howToEnumType ?? '')
    const idskContentRef = useRef<HTMLDivElement>(null)

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
            const hashElement = window.location.hash ? document.getElementById(window.location.hash.substring(1)) : null
            if (hashElement) {
                hashElement.scrollIntoView()
            }
        }, 500)
    }, [data, isLoading, isError])

    return (
        <>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <div ref={idskContentRef} className="wiki">
                    {data && (
                        <span
                            dangerouslySetInnerHTML={{ __html: data }}
                            onClick={(e) => {
                                const target = e.target as HTMLAnchorElement

                                if (target.tagName === 'A') {
                                    const href = target.getAttribute('href') ?? ''
                                    const targetUrl = new URL(href, baseWikiUrl)

                                    const isInternalLink = target.getAttribute('internal-link') === 'true'
                                    const isDownloadLink = targetUrl.pathname.startsWith('/download')

                                    if (isInternalLink && !isDownloadLink) {
                                        e.preventDefault()
                                        changeUrl(href)
                                    } else {
                                        target.setAttribute('target', '_blank')
                                    }
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
