import React from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { useSearchParams } from 'react-router-dom'

import { SimpleSelect } from '@isdd/idsk-ui-kit'

interface Props {
    pagingOptions?: { value: string; label: string }[]
    handlePagingSelect?: (page: string) => void
    className: string
    id: string
}

enum DefaultPagingEnum {
    TEN = '10',
    TWENTY = '20',
    FIFTY = '50',
    HUNDRED = '100',
}

export const PageSizeSelect: React.FC<Props> = ({ pagingOptions, handlePagingSelect, className, id }) => {
    const { t } = useTranslation()
    const [urlParams] = useSearchParams()
    const defaultPagingOptions = [
        { value: DefaultPagingEnum.TEN, label: DefaultPagingEnum.TEN },
        { value: DefaultPagingEnum.TWENTY, label: DefaultPagingEnum.TWENTY },
        { value: DefaultPagingEnum.FIFTY, label: DefaultPagingEnum.FIFTY },
        { value: DefaultPagingEnum.HUNDRED, label: DefaultPagingEnum.HUNDRED },
    ]
    return (
        <SimpleSelect
            className={classNames(className)}
            label={t('actionOverTable.view')}
            id={id}
            name={`name_${id}`}
            options={pagingOptions ? pagingOptions : defaultPagingOptions}
            onChange={(value) => handlePagingSelect && handlePagingSelect(value || '')}
            defaultValue={urlParams.get('pageSize') || defaultPagingOptions[0].value}
            isClearable={false}
        />
    )
}
