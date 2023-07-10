import React, { useState } from 'react'
import { SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'

interface IAddConnection {
    listOptions: { label: string; value: string; disabled?: boolean; selected?: boolean }[]
    onClose: () => void
}

enum Direction {
    SOURCE = 'source',
    TARGET = 'target',
}

export const AddConnectionView = ({ listOptions, onClose }: IAddConnection) => {
    const [direction, setDirection] = useState<Direction>(Direction.SOURCE)
    const { setValue, getValues } = useFormContext()
    const { t } = useTranslation()
    const optionsWithDefault = [{ label: t('egov.detail.selectOption'), disabled: true, value: '' }, ...listOptions]

    return (
        <>
            <SimpleSelect
                id="connections"
                label={t('egov.detail.direction.heading')}
                name={'direction'}
                options={[
                    { label: t('egov.detail.direction.source'), value: 'source' },
                    { label: t('egov.detail.direction.target'), value: 'target' },
                ]}
                onChange={(event) => {
                    if (event?.target?.value === Direction.SOURCE || event?.target?.value === Direction.TARGET) setDirection(event?.target?.value)
                }}
            />

            <SimpleSelect
                id={direction}
                label={t('egov.detail.connections')}
                options={optionsWithDefault}
                defaultValue={optionsWithDefault?.[0]?.value}
                onChange={() => {
                    const existingValueInForm = getValues(`${direction}s`)
                    if (existingValueInForm) {
                        setValue(`${direction}s`, [...existingValueInForm, JSON.parse(event?.target?.value)])
                    } else {
                        setValue(`${direction}s`, [JSON.parse(event?.target?.value)])
                    }
                    setValue(`${direction}Cardinality`, { min: 0, max: undefined })
                    onClose()
                }}
            />
        </>
    )
}
