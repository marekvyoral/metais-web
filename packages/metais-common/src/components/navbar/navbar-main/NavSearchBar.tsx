import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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

    const { register, handleSubmit } = useForm<SearchbarForm>()

    const onSubmit = (formData: SearchbarForm) => {
        if (formData[GlobalSearchParams.SEARCH]) {
            const searchUrlParams = new URLSearchParams(formData)
            const paginationUrlString = `&${GlobalSearchParams.PAGE}=${BASE_PAGE_NUMBER}&${GlobalSearchParams.PER_PAGE}=${BASE_PAGE_SIZE}`
            navigate(RouteNames.GLOBAL_SEARCH + `?${searchUrlParams}` + paginationUrlString)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classnames('idsk-header-web__main-action-search', styles.fullWidth)} noValidate>
            <input
                className="govuk-input govuk-!-display-inline-block"
                id="idsk-header-web__main-action-search-input"
                placeholder={t('navbar.searchPlaceholder') ?? ''}
                title={t('navbar.searchPlaceholder') ?? ''}
                type="search"
                aria-label={t('navbar.searchPlaceholder') ?? ''}
                {...register('search')}
            />
            <button type="submit" className="govuk-button" data-module="govuk-button">
                <span className="govuk-visually-hidden">{t('navbar.search')}</span>
                <i aria-hidden="true" className="fas fa-search" />
            </button>
        </form>
    )
}
