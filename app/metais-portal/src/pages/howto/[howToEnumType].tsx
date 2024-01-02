import React, { useEffect, useRef } from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useGetPageRender } from '@isdd/metais-common/src/hooks/wiki/useGetPageRender'
import { useLocation, useParams } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { baseWikiUrl } from '@isdd/metais-common/constants'
import { initAll } from '@id-sk/frontend/idsk/all'

import { MainContentWrapper } from '@/components/MainContentWrapper'

let initializedData = ''

const HowToGenericPage = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { howToEnumType } = useParams()
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
        }, 500)
    }, [data, isLoading, isError])

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t(`breadcrumbs.wiki.${howToEnumType}`), href: location.pathname },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={isError} withChildren>
                    <div ref={idskContentRef}>
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
            </MainContentWrapper>
        </>
    )
}

export default HowToGenericPage
