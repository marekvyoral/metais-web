import React, { useEffect, useState, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { UseFormSetValue } from 'react-hook-form'
import { TextWarning } from '@isdd/idsk-ui-kit'
import { MAX_DYNAMIC_ATTRIBUTES_LENGHT } from '@isdd/metais-common/constants/index'

import style from './customElement.module.scss'
import { DynamicRow, RenderableComponentProps } from './DynamicRow'

interface DynamicElementsProps<T extends object> {
    initialElementsData?: T[]
    defaultRenderableComponentData: T
    addItemButtonLabelText: string
    nonRemovableElementIndexes?: number[]
    renderableComponent: (index?: number, data?: RenderableComponentProps<T>) => React.ReactNode
    setValue?: UseFormSetValue<T>
    onChange?: (data: T[]) => void
}

export const DynamicElements: <T extends object>({
    initialElementsData,
    renderableComponent,
}: DynamicElementsProps<T>) => React.ReactElement<DynamicElementsProps<T>> = ({
    initialElementsData = [],
    defaultRenderableComponentData,
    addItemButtonLabelText,
    nonRemovableElementIndexes,
    renderableComponent,
    onChange,
}) => {
    const [dynamicElementsData, setDynamicElementsData] = useState(initialElementsData)
    const { t } = useTranslation()
    const [addRowError, setAddRowError] = useState<string>('')

    useEffect(() => {
        onChange?.(dynamicElementsData)
    }, [dynamicElementsData, onChange])

    const removeRow = (index: number) => {
        const copyDynamicElementsData = [...dynamicElementsData]
        copyDynamicElementsData.splice(index, 1)
        setDynamicElementsData(copyDynamicElementsData)
    }

    const addRow = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (dynamicElementsData.length < MAX_DYNAMIC_ATTRIBUTES_LENGHT) {
            setDynamicElementsData([...dynamicElementsData, defaultRenderableComponentData])
        } else {
            setAddRowError(t('customAttributeFilter.addRowErrorMessage', { value: MAX_DYNAMIC_ATTRIBUTES_LENGHT }))
        }
    }

    const doNotRemove = (elementIndex: number) => {
        return nonRemovableElementIndexes?.includes(elementIndex)
    }

    return (
        <div className={style.stretch}>
            {dynamicElementsData.map((elementData, index) => (
                <DynamicRow
                    key={'dynamic-row-' + index}
                    index={index}
                    defaultRowData={elementData}
                    renderableComponent={renderableComponent}
                    remove={removeRow}
                    doNotRemove={doNotRemove(index)}
                    onChange={(newData) => {
                        const copyDynamicElementsData = [...dynamicElementsData]
                        copyDynamicElementsData[index] = newData
                        setDynamicElementsData(copyDynamicElementsData)
                    }}
                />
            ))}
            {addRowError && (
                <div className={style.addRowErrorDiv}>
                    <TextWarning>{addRowError}</TextWarning>
                    <ButtonLink
                        className={style.addRowErrorClose}
                        label={t('customAttributeFilter.addRowErrorClose')}
                        onClick={() => setAddRowError('')}
                    />
                </div>
            )}
            <ButtonLink label={addItemButtonLabelText} className={style.addButton} type="button" onClick={addRow} />
        </div>
    )
}
