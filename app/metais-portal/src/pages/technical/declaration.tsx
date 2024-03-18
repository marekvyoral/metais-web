import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import sanitizeHtml, { defaults } from 'sanitize-html'
import { DECLARATION_ID, baseWikiUrl } from '@isdd/metais-common/constants'
import { useQuery } from '@tanstack/react-query'
import { QueryFeedback } from '@isdd/metais-common/index'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const fetchRenderPageHelp = async (lang: string, url: string) => {
    const response = await fetch(url, {
        headers: {
            'Accept-Language': lang,
        },
    })
    if (!response.ok) {
        throw new Error()
    }

    return response.text()
}

const DeclarationPage = () => {
    const { t } = useTranslation()
    const { i18n } = useTranslation()

    const DEFAULT_URL = `${baseWikiUrl}/page/render/webove_sidlo?weboveSidloCode=${DECLARATION_ID}`

    const {
        data: htmlString,
        isError,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: [DEFAULT_URL],
        queryFn: () => fetchRenderPageHelp(i18n.language, DEFAULT_URL),
    })

    useEffect(() => {
        refetch()
    }, [refetch, DEFAULT_URL, i18n.language])

    const sanitizedData = sanitizeHtml(htmlString ?? '', {
        allowedTags: defaults.allowedTags.concat(['img', 'button']),
        allowedAttributes: {
            ...defaults.allowedAttributes,
            a: defaults.allowedAttributes.a.concat(['internal-link', 'aria*']),
            '*': ['class', 'id', 'data-*', 'aria*', 'type', 'alt', 'title'],
        },
    })

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('technical.declaration'), href: FooterRouteNames.ACCESSIBILITY_DECLARATION },
                ]}
            />

            <MainContentWrapper>
                <QueryFeedback loading={isLoading || isFetching} error={isError} withChildren>
                    <div className="wiki" dangerouslySetInnerHTML={{ __html: sanitizeHtml(sanitizedData ?? '') }} />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default DeclarationPage
