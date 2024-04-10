import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'

export enum GlobalSearchParams {
    SEARCH = 'search',
    PAGE = 'page',
    PER_PAGE = 'pageSize',
    STATE = 'state',
    TOTAL_ITEMS = 'total',
}

type SearchbarForm = {
    [GlobalSearchParams.SEARCH]: string
}

export const NavSearchBar = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [uriParams] = useSearchParams()
    const { register, handleSubmit } = useForm<SearchbarForm>({
        defaultValues: { search: uriParams.get('search') ?? '' },
    })
    const inputId = 'idsk-header-web__main-action-search-input'

    const onSubmit = (formData: SearchbarForm) => {
        if (formData[GlobalSearchParams.SEARCH]) {
            const searchUrlParams = new URLSearchParams(formData)
            const paginationUrlString = `&${GlobalSearchParams.PAGE}=${BASE_PAGE_NUMBER}&${GlobalSearchParams.PER_PAGE}=${BASE_PAGE_SIZE}`
            const filter = uriParams.get('filter')
            const filterParams = filter ? `&filter=${new URLSearchParams(filter ?? '').toString().slice(0, -1)}` : ''
            navigate(RouteNames.GLOBAL_SEARCH + `?${searchUrlParams}` + paginationUrlString + filterParams)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classnames('idsk-header-web__main-action-search', styles.fullWidth)} noValidate>
            <input
                required
                className="govuk-input govuk-!-display-inline-block"
                id={inputId}
                placeholder={t('navbar.searchPlaceholder') ?? ''}
                title={t('navbar.searchPlaceholder') ?? ''}
                type="search"
                aria-label={t('navbar.searchPlaceholder') ?? ''}
                {...register('search')}
            />
            <button type="submit" className="govuk-button" data-module="govuk-button">
                <label htmlFor={inputId} className="govuk-visually-hidden">
                    {t('navbar.search')}
                </label>
                <i aria-hidden="true" className="fas fa-search" />
            </button>
        </form>
    )
}
