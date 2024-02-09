import React, { useState, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormSetValue } from 'react-hook-form'
import { TextWarning } from '@isdd/idsk-ui-kit'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'

import style from './customElement.module.scss'
import { DynamicRow, RenderableComponentProps } from './DynamicRow'

import { MAX_DYNAMIC_ATTRIBUTES_LENGHT } from '@isdd/metais-common/constants/index'

interface DynamicElementsProps<T extends object> {
    initialElementsData?: T[]
    defaultRenderableComponentData: T
    addItemButtonLabelText: string
    nonRemovableElementIndexes?: number[]
    renderableComponent: (index: number | undefined, data: RenderableComponentProps<T>) => React.ReactNode | undefined
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
    const [dynamicElementsData, setDynamicElementsData] = useState([...initialElementsData])
    const { t } = useTranslation()
    const [addRowError, setAddRowError] = useState<string>('')

    const removeRow = (index: number) => {
        const copyDynamicElementsData = [...dynamicElementsData]
        copyDynamicElementsData.splice(index, 1)
        setDynamicElementsData(copyDynamicElementsData)
        onChange?.(copyDynamicElementsData)
    }

    const addRow = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (dynamicElementsData.length < MAX_DYNAMIC_ATTRIBUTES_LENGHT) {
            setDynamicElementsData([...dynamicElementsData, defaultRenderableComponentData])
            onChange?.([...dynamicElementsData, defaultRenderableComponentData])
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
                    lastElement={dynamicElementsData.length == index + 1}
                    defaultRowData={elementData}
                    renderableComponent={renderableComponent}
                    remove={removeRow}
                    doNotRemove={doNotRemove(index)}
                    onChange={(newData) => {
                        const copyDynamicElementsData = [...dynamicElementsData]
                        copyDynamicElementsData[index] = newData
                        setDynamicElementsData(copyDynamicElementsData)
                        onChange?.(copyDynamicElementsData)
                    }}
                />
            ))}
            {addRowError && (
                <div className={style.addRowErrorDiv}>
                    <TextWarning>{addRowError}</TextWarning>
                    <ButtonLink label={t('dynamicElements.addRowErrorClose')} onClick={() => setAddRowError('')} />
                </div>
            )}
            <div className={style.spaceVertical}>
                <ButtonLink label={addItemButtonLabelText} className={style.addButton} type="button" onClick={addRow} />
            </div>
        </div>
    )
}
