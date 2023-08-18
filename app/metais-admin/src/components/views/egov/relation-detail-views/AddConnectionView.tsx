import React, { useState } from 'react'
import { SimpleSelect } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { CiTypePreview } from '@isdd/metais-common/api'

enum Direction {
    SOURCE = 'source',
    TARGET = 'target',
}

interface IAddConnection {
    listOptions: { label: string; value: string; disabled?: boolean; selected?: boolean }[]
    onClose: () => void
    addConnection?: (selectedConnection: CiTypePreview, ciTypeRoleEnum: 'TARGET' | 'SOURCE') => void
}

export const AddConnectionView = ({ listOptions, onClose, addConnection }: IAddConnection) => {
    const [direction, setDirection] = useState<Direction>(Direction.SOURCE)
    const methods = useFormContext()
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
                onChange={(event) => {
                    if (!addConnection) {
                        const existingValueInForm = methods?.getValues(`${direction}s`)
                        if (existingValueInForm) {
                            methods?.setValue(`${direction}s`, [...existingValueInForm, JSON.parse(event?.target?.value)])
                        } else {
                            methods?.setValue(`${direction}s`, [JSON.parse(event?.target?.value)])
                        }
                        methods?.setValue(`${direction}Cardinality`, { min: 0, max: undefined })
                    } else {
                        addConnection(JSON.parse(event?.target?.value), direction === Direction.SOURCE ? 'SOURCE' : 'TARGET')
                    }
                    onClose()
                }}
            />
        </>
    )
}
