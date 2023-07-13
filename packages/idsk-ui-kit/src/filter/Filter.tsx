import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Control, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { IFilterParams, useFilter } from '@isdd/metais-common/hooks/useFilter'

import styles from './filter.module.scss'

import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { SearchInput } from '@isdd/idsk-ui-kit/searchInput'

type FilterProps<T extends FieldValues & IFilterParams> = {
    heading?: React.ReactNode
    form: (register: UseFormRegister<T>, control: Control<T>, filter: T, setValue: UseFormSetValue<T>) => React.ReactNode
    defaultFilterValues: T
}

export const Filter = <T extends FieldValues & IFilterParams>({ form, heading, defaultFilterValues }: FilterProps<T>) => {
    const {
        register,
        control,
        setValue,
        onSubmit,
        filter,
        shouldBeFilterOpen,
        resetFilters: reset,
    } = useFilter<T & IFilterParams>(defaultFilterValues)
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(shouldBeFilterOpen)
    if (!heading) {
        heading = (
            <form onSubmit={onSubmit}>
                <SearchInput
                    id={'fullTextSearch'}
                    placeholder={t('filter.searchPlaceholder')}
                    {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        ...register('fullTextSearch')
                    }
                    style={{ margin: 0, width: '100%' }}
                />
            </form>
        )
    }
    return (
        <div data-module="idsk-table-filter" className={classNames('idsk-table-filter', styles.filter)}>
            <div className={classNames('idsk-table-filter__panel idsk-table-filter__inputs', { 'idsk-table-filter--expanded': isOpen })}>
                <div className={styles.headingWrapper}>
                    <div className={classNames(styles.heading, 'idsk-table-filter__title govuk-heading-m')}>{heading}</div>
                    <div className={styles.expandButton}>
                        <button
                            onClick={() => setOpen(!isOpen)}
                            className="govuk-body govuk-link idsk-filter-menu__toggle"
                            tabIndex={0}
                            data-category-name=""
                            aria-label={isOpen ? t('filter.collapse') : t('filter.expand')}
                            type="button"
                        >
                            {isOpen ? t('filter.collapse') : t('filter.expand')}
                        </button>
                    </div>
                </div>

                <div className={styles.formWrapper}>
                    <form
                        className={classNames('', { 'idsk-table-filter__content--expanded': isOpen, 'idsk-table-filter__content': !isOpen })}
                        action="#"
                        onSubmit={(e) => onSubmit(e)}
                    >
                        {form(register, control, filter, setValue)}
                        <div className={styles.actionRow}>
                            <ButtonLink label={t('filter.reset')} onClick={reset} className={styles.clearButton} type="reset" />
                            <Button label={t('filter.submit')} type="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
