import { BaseModal, Button, SelectLazyLoading, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { AttributeAttributeTypeEnum, useReadCiList1 } from '@isdd/metais-common/api'

import styles from '../styles.module.scss'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'

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
interface addMemberPopUpProps {
    isOpen: boolean
    onClose: () => void
}
const KSIVSAddMemberPopUp: React.FC<addMemberPopUpProps> = ({ isOpen, onClose }) => {
    const formMethods = useForm()
    const { handleSubmit, register } = formMethods
    // const { data } = useReadCiList1() : Organizations - LazyLoading
    // {"filter":{"type":["PO"],"metaAttributes":{"state":["DRAFT"]}},"page":8,"perpage":20,"sortBy":"Gen_Profil_nazov","sortType":"ASC","totalPages":279}
    const onSubmit = (formData: FieldValues) => {
        ;<></>
    }
    return (
        <>
            <BaseModal isOpen={isOpen} close={onClose}>
                <TextHeading size="L">Pridať člena</TextHeading>
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AttributeInput attribute={fullNameAttr} constraints={constraints} register={register} error={''} isSubmitted={false} />
                        <AttributeInput attribute={shortNameAttr} constraints={constraints} register={register} error={''} isSubmitted={false} />
                        {/* <SelectLazyLoading /> */}
                        <AttributeInput
                            attribute={descriptionAttribute}
                            constraints={constraints}
                            register={register}
                            error={''}
                            isSubmitted={false}
                        />
                        <AttributeInput attribute={checkBox1Attribute} constraints={constraints} register={register} error={''} isSubmitted={false} />
                        <div className={styles.marginVertical20}>
                            <AttributeInput
                                attribute={checkBox2Attribute}
                                constraints={constraints}
                                register={register}
                                error={''}
                                isSubmitted={false}
                            />
                        </div>
                        <AttributeInput attribute={checkBox3Attribute} constraints={constraints} register={register} error={''} isSubmitted={false} />
                        <div style={{ display: 'flex' }}>
                            <Button label="Submit" type="submit" className={styles.marginLeftAuto} />
                        </div>
                    </form>
                </FormProvider>
            </BaseModal>
        </>
    )
}
export default KSIVSAddMemberPopUp
