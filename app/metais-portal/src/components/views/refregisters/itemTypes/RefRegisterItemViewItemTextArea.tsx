import { TextArea } from '@isdd/idsk-ui-kit/index'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import React from 'react'
import { UseFormRegister } from 'react-hook-form'
import { ApiReferenceRegisterItem } from '@isdd/metais-common/api/generated/reference-registers-swagger'

import styles from './refRegisterItemViewItems.module.scss'

import { RefRegisterItemItemsFieldNames } from '@/types/filters'
interface iRefRegisterItemViewItemTextArea {
    isChangeMode: boolean
    tooltip?: string
    value: string | undefined
    name: RefRegisterItemItemsFieldNames
    register?: UseFormRegister<ApiReferenceRegisterItem>
    label: string
}

export const RefRegisterItemViewItemTextArea = ({ register, name, label, value, tooltip, isChangeMode }: iRefRegisterItemViewItemTextArea) => {
    const formatRow = () => {
        const sentences = value?.split('\n')
        return sentences?.map((sentence) => {
            return <div key={sentence}>{sentence}</div>
        })
    }

    if (isChangeMode)
        return (
            <div className={styles.inputPadding}>
                <TextArea name={name} {...register?.(name)} label={label} rows={3} info={tooltip} />
            </div>
        )
    return <InformationGridRow key={name} label={label} value={formatRow()} tooltip={tooltip} />
}
