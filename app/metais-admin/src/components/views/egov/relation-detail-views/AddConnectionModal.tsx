import React, { useState } from 'react'
import { BaseModal, SimpleSelect } from '@isdd/idsk-ui-kit'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { AttributeProfile, Cardinality, CiTypePreview } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'

import { EntityListContainer } from '@/components/containers/Egov/Entity/EntityListContainer'

interface ConnectionModal {
    open: boolean
    onClose: () => void
    setValue: UseFormSetValue<{
        name: string
        engName: string
        technicalName: string
        codePrefix: string | undefined
        uriPrefix: string | undefined
        description: string
        engDescription: string | undefined
        attributeProfiles: AttributeProfile[] | undefined
        roleList: (string | undefined)[]
        type: string
        sources: CiTypePreview[] | undefined
        sourceCardinality: Cardinality | undefined
        targets: CiTypePreview[] | undefined
        targetCardinality: Cardinality | undefined
    }>
    control: Control<
        {
            name: string
            engName: string
            technicalName: string
            codePrefix: string | undefined
            uriPrefix: string | undefined
            description: string
            engDescription: string | undefined
            attributeProfiles: AttributeProfile[] | undefined
            roleList: (string | undefined)[]
            type: string
            sources: CiTypePreview[] | undefined
            sourceCardinality: Cardinality | undefined
            targets: CiTypePreview[] | undefined
            targetCardinality: Cardinality | undefined
        },
        unknown
    >
}

enum Direction {
    SOURCE = 'source',
    TARGET = 'target',
}

export const AddConnectionModal = ({ onClose, open, setValue, control }: ConnectionModal) => {
    const { t } = useTranslation()
    const [direction, setDirection] = useState<Direction>(Direction.SOURCE)

    return (
        <BaseModal isOpen={open} close={onClose}>
            <EntityListContainer
                View={(props) => {
                    const listData = props?.data?.results
                    const listOptions =
                        listData?.map((data) => {
                            return {
                                value: JSON.stringify(data) ?? '',
                                label: data?.name ?? '',
                            }
                        }) ?? []
                    return (
                        <>
                            <SimpleSelect
                                id="connections"
                                label={t('egov.detail.direction')}
                                name={'direction'}
                                options={[
                                    { label: 'Source', value: 'sources' },
                                    { label: 'Target', value: 'targets' },
                                ]}
                                onChange={(event) => {
                                    if (event?.target?.value === Direction.SOURCE || event?.target?.value === Direction.TARGET)
                                        setDirection(event?.target?.value)
                                }}
                            />

                            <Controller
                                control={control}
                                name={`${direction}s`}
                                render={({ field: { onBlur, value, name, ref } }) => (
                                    <SimpleSelect
                                        id={direction}
                                        label={t('egov.detail.connection')}
                                        options={listOptions}
                                        onChange={(event) => {
                                            if (value) {
                                                setValue(`${direction}s`, [...value, JSON.parse(event?.target?.value)])
                                            } else {
                                                setValue(`${direction}s`, [JSON.parse(event?.target?.value)])
                                            }
                                            setValue(`${direction}Cardinality`, { min: 0, max: undefined })
                                            onClose()
                                        }}
                                        onBlur={onBlur}
                                        name={name}
                                        ref={ref}
                                    />
                                )}
                            />
                        </>
                    )
                }}
            />
        </BaseModal>
    )
}
