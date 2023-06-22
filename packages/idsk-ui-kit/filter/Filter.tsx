import React, { FC, useState } from 'react'

type FilterProps = {
    heading: React.ReactNode
    form: React.ReactNode
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Filter: FC<FilterProps> = ({ form, heading, onSubmit }) => {
    const [isOpen, setOpen] = useState(false)
    return (
        <div data-module="idsk-table-filter" id="example-table-2-filter" className="idsk-table-filter">
            <div className={`idsk-table-filter__panel idsk-table-filter__inputs ${isOpen ? 'idsk-table-filter--expanded' : ''}`}>
                <div className="idsk-table-filter__title govuk-heading-m">{heading}</div>
                <button
                    onClick={() => setOpen(!isOpen)}
                    className="govuk-body govuk-link idsk-filter-menu__toggle"
                    tabIndex={0}
                    data-category-name=""
                    aria-label={isOpen ? 'Zbaliť obsah filtra' : 'Rozbaliť obsah filtra'}
                    type="button"
                >
                    {isOpen ? 'Zbaliť obsah filtra' : 'Rozbaliť obsah filtra'}
                </button>

                <form className={`idsk-table-filter__content${isOpen ? '--expanded' : ''}`} action="#" onSubmit={(e) => onSubmit(e)}>
                    {form}
                </form>
            </div>
        </div>
    )
}
