import classNames from 'classnames'
import React, { FC, useState } from 'react'
import {useTranslation} from "react-i18next";

type FilterProps = {
    heading: React.ReactNode
    form: React.ReactNode
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Filter: FC<FilterProps> = ({ form, heading, onSubmit }) => {
    const { t } = useTranslation()
    const [isOpen, setOpen] = useState(false)
    return (
        <div data-module="idsk-table-filter" id="example-table-2-filter" className="idsk-table-filter">
            <div className={classNames('idsk-table-filter__panel idsk-table-filter__inputs', { 'idsk-table-filter--expanded': isOpen })}>
                <div className="idsk-table-filter__title govuk-heading-m">{heading}</div>
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

                <form className={classNames('idsk-table-filter__content', { 'idsk-table-filter__content--expanded': isOpen })} action="#" onSubmit={(e) => onSubmit(e)}>
                    {form}
                </form>
            </div>
        </div>
    )
}
