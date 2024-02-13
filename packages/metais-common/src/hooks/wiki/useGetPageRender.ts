import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitizeHtml, { defaults } from 'sanitize-html'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { baseWikiUrl } from '@isdd/metais-common/constants'

export const WIKI_SEARCH_KEY = 'xwiki'

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

export const useGetPageRender = (howToType: string) => {
    const { i18n } = useTranslation()

    const DEFAULT_URL = `${baseWikiUrl}/page/render/help/${howToType}?transformations=view&transformations=download`
    const [searchParams] = useSearchParams()
    const [url, setUrl] = useState<string>(DEFAULT_URL)
    const currentWikiSearchUrl = searchParams.get(WIKI_SEARCH_KEY)
    const navigate = useNavigate()

    const {
        data: htmlString,
        isError,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: [baseWikiUrl, url, currentWikiSearchUrl, i18n.language],
        queryFn: () => fetchRenderPageHelp(i18n.language, currentWikiSearchUrl ? currentWikiSearchUrl : url),
    })

    useEffect(() => {
        setUrl(`${baseWikiUrl}/page/render/help/${howToType}?transformations=view&transformations=download`)
    }, [howToType])

    const changeUrl = (newUrl: string) => {
        const newUrlObj = new URL(newUrl, baseWikiUrl)
        const hash = '' + newUrlObj.hash || ''
        newUrlObj.hash = ''
        const redirectUrl = new URL(document.baseURI)
        redirectUrl.searchParams.set(WIKI_SEARCH_KEY, newUrlObj.href)
        redirectUrl.hash = hash
        navigate(redirectUrl.pathname + redirectUrl.search + hash)
    }

    const sanitisedData = sanitizeHtml(htmlString ?? '', {
        allowedTags: defaults.allowedTags.concat(['img', 'button']),
        allowedAttributes: {
            ...defaults.allowedAttributes,
            a: defaults.allowedAttributes.a.concat(['internal-link', 'aria*']),
            '*': ['class', 'id', 'data-*', 'aria*', 'type', 'alt', 'title', 'style', 'clear'],
        },
    })

    return {
        data: sanitisedData,
        isError,
        isLoading: isLoading || isFetching,
        changeUrl,
    }
}
