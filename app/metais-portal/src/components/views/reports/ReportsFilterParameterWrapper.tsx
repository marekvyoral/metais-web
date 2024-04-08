import { Filter } from '@isdd/idsk-ui-kit/filter'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Parameter } from '@isdd/metais-common/api/generated/report-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ReportsFilter } from './ReportsFilter'

import { getDefaultValueForKey } from '@/componentHelpers'

interface IReportsFilterParameterWrapperProps {
    defaultFilterValues: IFilterParams & { [key: string]: string }
    parameters?: Parameter[]
    filterEnumData?: (EnumType | undefined)[]
}

export const ReportsFilterParameterWrapper: React.FC<IReportsFilterParameterWrapperProps> = ({ defaultFilterValues, parameters, filterEnumData }) => {
    const { t } = useTranslation()
    const parameterKeys = parameters?.map((parameter) => (parameter?.required ? parameter?.key : undefined)).filter(Boolean)
    const dynamicFilterValues = {
        ...defaultFilterValues,
        ...Object.fromEntries(parameterKeys?.map((key) => [key, getDefaultValueForKey(key, parameters)]) ?? []),
    }
    return (
        <Filter<IFilterParams & { [key: string]: string }>
            defaultFilterValues={dynamicFilterValues}
            form={(formProps) => <ReportsFilter parameters={parameters} formProps={formProps} filterEnumData={filterEnumData} />}
        />
    )
}
