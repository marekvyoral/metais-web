import { TextWarning } from '@isdd/idsk-ui-kit'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import React, { MouseEvent, useId, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import style from './customElement.module.scss'
import { DynamicRow, RenderableComponentProps } from './DynamicRow'

import { MAX_DYNAMIC_ATTRIBUTES_LENGHT } from '@isdd/metais-common/constants/index'

interface DynamicElementsProps<T extends object> {
    initialElementsData?: T[]
    defaultRenderableComponentData: T
    addItemButtonLabelText: string
    removeLabelSubject: (index: number) => string
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
    removeLabelSubject,
    nonRemovableElementIndexes,
    renderableComponent,
    onChange,
}) => {
    const [dynamicElementsData, setDynamicElementsData] = useState([...initialElementsData])
    const { t } = useTranslation()
    const [addRowError, setAddRowError] = useState<string>('')
    const id = useId()

    const removeRow = (index: number) => {
        const copyDynamicElementsData = [...dynamicElementsData]
        copyDynamicElementsData.splice(index, 1)
        setDynamicElementsData(copyDynamicElementsData)
        onChange?.(copyDynamicElementsData)
    }

    const getFocusableId = (index: number) => {
        const DYNAMIC_ROW = 'dynamic-row-'
        return `${id}-${DYNAMIC_ROW}-${index}`
    }

    const addRow = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (dynamicElementsData.length < MAX_DYNAMIC_ATTRIBUTES_LENGHT) {
            setDynamicElementsData([...dynamicElementsData, defaultRenderableComponentData])
            onChange?.([...dynamicElementsData, defaultRenderableComponentData])
        } else {
            setAddRowError(t('dynamicElements.addRowErrorMessage', { value: MAX_DYNAMIC_ATTRIBUTES_LENGHT }))
        }
    }

    const changeFocusToFirstInteractiveElement = () => {
        const divWithFocusId = document.getElementById(getFocusableId(dynamicElementsData.length))
        if (divWithFocusId) {
            const firstInput = divWithFocusId?.querySelector('input')
            if (firstInput) {
                firstInput.focus()
            } else {
                divWithFocusId?.focus()
            }
        }
    }

    const doNotRemove = (elementIndex: number) => {
        return nonRemovableElementIndexes?.includes(elementIndex)
    }

    return (
        <div className={style.stretch}>
            <span className="govuk-visually-hidden" role="alert">
                {t('arrayInput.changeRowsNumber', { name: '', count: dynamicElementsData.length })}
            </span>
            {dynamicElementsData.map((elementData, index) => (
                <DynamicRow
                    id={getFocusableId(index)}
                    key={getFocusableId(index)}
                    index={index}
                    lastElement={dynamicElementsData.length == index + 1}
                    defaultRowData={elementData}
                    renderableComponent={renderableComponent}
                    remove={removeRow}
                    removeLabelSubject={removeLabelSubject(index)}
                    doNotRemove={doNotRemove(index)}
                    onChange={(newData) => {
                        const copyDynamicElementsData = [...dynamicElementsData]
                        copyDynamicElementsData[index] = newData
                        setDynamicElementsData(copyDynamicElementsData)
                        onChange?.(copyDynamicElementsData)
                    }}
                />
            ))}
            <div className={style.addRowErrorDiv} aria-live="polite" role="alert">
                {addRowError && (
                    <>
                        <TextWarning>{addRowError}</TextWarning>
                        <ButtonLink label={t('dynamicElements.addRowErrorClose')} onClick={() => setAddRowError('')} />
                    </>
                )}
            </div>
            <div className={style.spaceVertical}>
                <ButtonLink
                    label={addItemButtonLabelText}
                    className={style.addButton}
                    type="button"
                    onClick={(e) => {
                        addRow(e).then(() => {
                            changeFocusToFirstInteractiveElement()
                        })
                    }}
                />
            </div>
        </div>
    )
}
