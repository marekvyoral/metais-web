import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React from 'react'
import { Input } from '@isdd/idsk-ui-kit/index'
import { UseFormRegister } from 'react-hook-form'
import { ApiReferenceRegisterItem } from '@isdd/metais-common/api/generated/reference-registers-swagger'

import styles from './refRegisterItemViewItems.module.scss'

import { RefRegisterItemItemsFieldNames } from '@/types/filters'
interface iRefRegisterItemViewItemInput {
    isChangeMode: boolean
    tooltip?: string
    value: string | undefined
    name: RefRegisterItemItemsFieldNames
    register?: UseFormRegister<ApiReferenceRegisterItem>
    label: string
}

export const RefRegisterItemViewItemInput = ({ isChangeMode, tooltip, value, name, register, label }: iRefRegisterItemViewItemInput) => {
    if (isChangeMode)
        return (
            <div className={styles.inputPadding}>
                <Input name={name} {...register?.(name)} label={label} info={tooltip} />
            </div>
        )
    return <InformationGridRow key={name} label={label} value={value} tooltip={tooltip} />
}
