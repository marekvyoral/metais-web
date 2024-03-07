import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import classNames from 'classnames'
import { FieldValues, UseFormRegister } from 'react-hook-form'

import style from './customElement.module.scss'

export interface RenderableComponentProps<T> {
    data?: T
    onChange?: (data: T) => void
    register?: UseFormRegister<FieldValues>
}

interface DynamicRowProps<T extends object> {
    index: number
    lastElement: boolean
    defaultRowData?: T
    doNotRemove?: boolean
    renderableComponent: (index: number | undefined, props: RenderableComponentProps<T>) => ReactNode
    onChange?: (data: T) => void
    remove?: (index: number) => void
    removeLabelSubject: string
    register?: UseFormRegister<FieldValues>
    id: string
}

export const DynamicRow: <T extends object>({
    index,
    renderableComponent,
    defaultRowData,
    doNotRemove,
    onChange,
    remove,
    register,
}: DynamicRowProps<T>) => ReactElement<DynamicRowProps<T>> = ({
    index,
    lastElement,
    defaultRowData,
    doNotRemove,
    renderableComponent,
    onChange,
    remove,
    removeLabelSubject,
    register,
    id,
}) => {
    const { t } = useTranslation()

    return (
        <div className={classNames(style.inline, style.spaceVertical)}>
            <div className={style.stretch} tabIndex={-1} id={id}>
                {renderableComponent(index, { data: defaultRowData, onChange, register })}
            </div>
            {!doNotRemove && lastElement && (
                <ButtonLink
                    onClick={(e) => {
                        e.preventDefault()
                        remove?.(index)
                    }}
                    type="button"
                    className={style.trashIcon}
                    label={
                        <>
                            <span className="govuk-visually-hidden">{t('dynamicElements.removeItem', { subject: removeLabelSubject })}</span>
                            <i aria-hidden="true" className="fas fa-trash" />
                        </>
                    }
                />
            )}
        </div>
    )
}
