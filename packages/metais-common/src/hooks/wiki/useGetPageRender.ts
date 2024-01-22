import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitizeHtml, { defaults } from 'sanitize-html'
import { useSearchParams } from 'react-router-dom'

import { baseWikiUrl } from '@isdd/metais-common/constants'

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

    const WIKI_search_key = 'xwiki'
    const DEFAULT_URL = `${baseWikiUrl}/page/render/help/${howToType}?transformations=view&transformations=download`
    const [searchParams, setSearchParams] = useSearchParams()
    const [url, setUrl] = useState<string>(DEFAULT_URL)
    const currentWikiSearchUrl = searchParams.get(WIKI_search_key)

    const {
        data: htmlString,
        isError,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: [baseWikiUrl, url, currentWikiSearchUrl],
        queryFn: () => fetchRenderPageHelp(i18n.language, currentWikiSearchUrl ? currentWikiSearchUrl : url),
    })

    useEffect(() => {
        refetch()
    }, [refetch, url, currentWikiSearchUrl, i18n.language])

    useEffect(() => {
        setUrl(`${baseWikiUrl}/page/render/help/${howToType}?transformations=view&transformations=download`)
    }, [howToType])

    const changeUrl = (newUrl: string) => {
        setSearchParams(() => {
            const newSearchParams = new URLSearchParams()
            newSearchParams.set(WIKI_search_key, newUrl)
            return newSearchParams
        })
    }

    const sanitisedData = sanitizeHtml(htmlString ?? '', {
        allowedTags: defaults.allowedTags.concat(['img', 'button']),
        allowedAttributes: {
            ...defaults.allowedAttributes,
            a: defaults.allowedAttributes.a.concat(['internal-link', 'aria*']),
            '*': ['class', 'id', 'data-*', 'aria*', 'type', 'alt', 'title'],
        },
    })

    return {
        data: sanitisedData,
        isError,
        isLoading: isLoading || isFetching,
        changeUrl,
    }
}
