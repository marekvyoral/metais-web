import { BaseModal, Button, ButtonGroupRow, SimpleSelect, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { AttributeAttributeTypeEnum, useReadCiList1 } from '@isdd/metais-common/api'

import styles from '../styles.module.scss'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { FindRelatedIdentitiesAndCountParams } from '@isdd/metais-common/api/generated/iam-swagger'

const textAttribute = {
    defaultValue: 'c_spolocne_moduly.1',
    constraints: [{ type: 'enum', enumCode: 'SPOLOCNE_MODULY' }],
}

const fullNameAttr = {
    ...textAttribute,
    name: 'Člen',
    technicalName: 'member',
    mandatory: { type: 'critical' },
}

const shortNameAttr = {
    ...textAttribute,
    name: 'Organizácia',
    technicalName: 'organization',
    mandatory: { type: 'critical' },
}

const descriptionAttribute = {
    ...textAttribute,
    name: 'Rola',
    technicalName: 'role',
    mandatory: { type: 'critical' },
}

const checkBox1Attribute = {
    ...textAttribute,
    name: 'Pridať do prebiehajúcich zasadnutí',
    technicalName: 'checkbox1',
    attributeTypeEnum: AttributeAttributeTypeEnum.BOOLEAN,
}

const checkBox2Attribute = {
    ...textAttribute,
    name: 'Pridať do prebiehajúcich hlasovaní',
    technicalName: 'checkbox2',
    attributeTypeEnum: AttributeAttributeTypeEnum.BOOLEAN,
}

const checkBox3Attribute = {
    ...textAttribute,
    name: 'Vidí e-mailové adresy',
    technicalName: 'checkbox3',
    attributeTypeEnum: AttributeAttributeTypeEnum.BOOLEAN,
}

const constraints = {
    category: '',
    code: 'CODE',
    description: 'DESCRIPTION',
    //get data from hwo to Display constraints
    enumItems: [
        {
            id: 10352,
            code: 'c_spolocne_moduly.1',
            value: 'Autentication modul',
            valid: true,
            description: 'Autentication modul',
            orderList: 1,
            engValue: 'Autentication modul',
            engDescription: 'Autentication modul',
        },
    ],
    id: 1,
    name: 'name',
    valid: true,
}
interface KSIVSTAbleActionsProps {
    listParams: FindRelatedIdentitiesAndCountParams
    setListParams: (value: React.SetStateAction<FindRelatedIdentitiesAndCountParams>) => void
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const KSIVSTableActions: React.FC<KSIVSTAbleActionsProps> = ({ listParams, setListParams, setAddModalOpen }) => {
    const formMethods = useForm()
    const { handleSubmit, register } = formMethods
    // const { data } = useReadCiList1()
    const onSubmit = (formData: FieldValues) => {
        ;<></>
    }
    return (
        <>
            <ButtonGroupRow>
                <Button label="Export" variant="secondary" />
                <Button label="Poslať email" variant="secondary" />
                <Button label="+ Pridať člena" onClick={() => setAddModalOpen(true)} />
                <TextBody className={styles.marginLeftAuto}>Zobrazit</TextBody>
                <SimpleSelect
                    onChange={(label) => {
                        setListParams({ ...listParams, perPage: label.target.value })
                    }}
                    id="select"
                    label=""
                    options={[
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '50', value: '50' },
                        { label: '100', value: '100' },
                    ]}
                />
            </ButtonGroupRow>
        </>
    )
}
export default KSIVSTableActions
