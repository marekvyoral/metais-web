import { IFilterParams, useFilter } from '@isdd/metais-common/hooks/useFilter'
import classNames from 'classnames'
import React, { useCallback, useEffect, useId, useState } from 'react'
import { Control, FieldValues, SubmitHandler, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ObjectSchema } from 'yup'
import { MutationFeedback } from '@isdd/metais-common'

import styles from './filter.module.scss'

import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { SearchInput } from '@isdd/idsk-ui-kit/searchInput'

export interface FormProps<T extends FieldValues & IFilterParams> {
    register: UseFormRegister<T>
    control: Control<T>
    filter: T
    setValue: UseFormSetValue<T>
    watch: UseFormWatch<T>
    clearErrors: UseFormClearErrors<T>
    isOpen: boolean
}

type FilterProps<T extends FieldValues & IFilterParams> = {
    heading?: React.ReactNode
    form: (props: FormProps<T>) => React.ReactNode
    handleOnSubmit?: SubmitHandler<T & IFilterParams>
    defaultFilterValues: T
    schema?: ObjectSchema<T & IFilterParams>
    onlySearch?: boolean
    onlyForm?: boolean
    customReset?: (resetFilters: () => void) => void
}

export const Filter = <T extends FieldValues & IFilterParams>({
    form,
    handleOnSubmit,
    heading,
    defaultFilterValues,
    schema,
    onlySearch,
    onlyForm,
    customReset,
}: FilterProps<T>) => {
    const { watch, register, control, setValue, onSubmit, filter, shouldBeFilterOpen, resetFilters, clearErrors, handleSubmit, hasBeenCleared } =
        useFilter<T & IFilterParams>(defaultFilterValues, schema)
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(shouldBeFilterOpen || !!onlyForm)
    const [showScrollbar, setShowscrollbar] = useState(isOpen)
    const [showCleared, setShowCleared] = useState(false)
    const contentId = useId()

    if (!heading) {
        heading = (
            <form onSubmit={handleOnSubmit ? handleSubmit(handleOnSubmit) : onSubmit} noValidate>
                <SearchInput
                    id={'fullTextSearch'}
                    placeholder={t('filter.searchPlaceholder') ?? ''}
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

    const handleOpenCloseForm = useCallback(() => {
        setOpen(!isOpen)
        if (isOpen) {
            setShowscrollbar(!isOpen)
        } else {
            setTimeout(() => {
                setShowscrollbar(!isOpen)
            }, 500)
        }
    }, [isOpen])

    const handleReset = useCallback(() => {
        if (customReset) {
            customReset(resetFilters)
        } else {
            resetFilters()
        }
    }, [customReset, resetFilters])

    useEffect(() => {
        if (hasBeenCleared) {
            setShowCleared(true)
        }
    }, [hasBeenCleared])

    return (
        <div id="tableFilter" data-module="idsk-table-filter" className={classNames('idsk-table-filter', styles.filter)}>
            <div className={classNames('idsk-table-filter__panel idsk-table-filter__inputs', { 'idsk-table-filter--expanded': isOpen })}>
                <MutationFeedback
                    success={showCleared}
                    successMessage={t('filter.cleared')}
                    onMessageClose={() => {
                        setShowCleared(false)
                    }}
                />
                {!onlyForm && (
                    <div className={styles.headingWrapper}>
                        <div className={classNames(styles.heading, 'idsk-table-filter__title govuk-heading-m', !!onlySearch && styles.width100)}>
                            {heading}
                        </div>
                        {!onlySearch && (
                            <div className={styles.expandButton}>
                                <button
                                    id="expandFilter"
                                    onClick={handleOpenCloseForm}
                                    className="govuk-body govuk-link idsk-filter-menu__toggle"
                                    tabIndex={0}
                                    data-category-name=""
                                    aria-label={isOpen ? t('filter.collapse').toString() : t('filter.expand').toString()}
                                    aria-controls={contentId}
                                    type="button"
                                >
                                    {isOpen ? t('filter.collapse') : t('filter.expand')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!onlySearch && (
                    <div id={contentId} aria-hidden={!isOpen} className={classNames({ [styles.hidden]: !isOpen })}>
                        <form
                            className={classNames(styles.animate, isOpen && styles.grow, showScrollbar && styles.form)}
                            action="#"
                            onSubmit={handleOnSubmit ? handleSubmit(handleOnSubmit) : onSubmit}
                            noValidate
                        >
                            <div
                                className={classNames({
                                    [styles.formWrapper]: true,
                                })}
                            >
                                {form({ register, control, filter, setValue, watch, clearErrors, isOpen })}
                                <div className={styles.actionRow}>
                                    <ButtonLink
                                        id="resetFilter"
                                        label={t('filter.reset')}
                                        onClick={handleReset}
                                        className={styles.clearButton}
                                        type="reset"
                                    />
                                    <Button label={t('filter.submit')} type="submit" id="submitFilter" />
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
