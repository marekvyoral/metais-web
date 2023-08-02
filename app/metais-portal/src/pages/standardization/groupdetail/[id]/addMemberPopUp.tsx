import { BaseModal, Button, SelectLazyLoading, TextHeading } from '@isdd/idsk-ui-kit/index'
import { AttributeAttributeTypeEnum, useReadCiList1Hook } from '@isdd/metais-common/api'
import React, { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { MultiValue } from 'react-select'

import styles from '../styles.module.scss'

import { DEFAULT_ROLES } from './defaultRoles'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'

const textAttribute = {
    constraints: [{ type: 'enum', enumCode: 'SPOLOCNE_MODULY' }],
}

const memberAttr = {
    ...textAttribute,
    name: 'Člen',
    technicalName: 'member',
    mandatory: { type: 'critical' },
}

const organizationAttr = {
    ...textAttribute,
    name: 'Organizácia',
    technicalName: 'organization',
    mandatory: { type: 'critical' },
}

const roleAttr = {
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

const roleConstraints = {
    category: 'role',
    code: 'ROLE',
    description: 'role',
    //get data from hwo to Display constraints
    enumItems: [...DEFAULT_ROLES],
    id: 1,
    name: 'role',
    valid: true,
}
interface addMemberPopUpProps {
    isOpen: boolean
    onClose: () => void
    setAddedLabel: React.Dispatch<React.SetStateAction<boolean>>
}

const KSIVSAddMemberPopUp: React.FC<addMemberPopUpProps> = ({ isOpen, onClose, setAddedLabel }) => {
    const formMethods = useForm()
    const { handleSubmit, register } = formMethods
    const loadOrgs = useReadCiList1Hook()
    // {"filter":{"type":["PO"],"metaAttributes":{"state":["DRAFT"]}},"page":8,"perpage":20,"sortBy":"Gen_Profil_nazov","sortType":"ASC","totalPages":279}
    const onSubmit = (formData: FieldValues) => {
        console.log('formData', formData)
        setAddedLabel(true)
        onClose()
        ;<></>
    }

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1
        const options = (await loadOrgs({
            sortBy: 'Gen_Profil_nazov',
            sortType: 'ASC',
            perpage: 20,
            page: page,
            filter: {
                fullTextSearch: searchQuery,
                type: ['PO'],
                metaAttributes: {
                    state: ['DRAFT'],
                },
            },
        }).then((response) => response.json())) as { name: string }[]
        return {
            options: options || [],
            hasMore: options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const [selectedOrganization, setSelectedOrganization] = useState<any | MultiValue<any> | null>(null)

    return (
        <>
            <BaseModal isOpen={isOpen} close={onClose}>
                <TextHeading size="L">Pridať člena</TextHeading>
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AttributeInput attribute={memberAttr} constraints={roleConstraints} register={register} error={''} isSubmitted={false} />
                        <AttributeInput
                            attribute={organizationAttr}
                            constraints={roleConstraints}
                            register={register}
                            error={''}
                            isSubmitted={false}
                        />
                        <SelectLazyLoading
                            value={selectedOrganization}
                            onChange={(newValue) => setSelectedOrganization(newValue)}
                            label={'Organization'}
                            name={'organization'}
                            getOptionValue={function (item: unknown): string {
                                throw new Error('Function not implemented.')
                            }}
                            getOptionLabel={function (item: unknown): string {
                                throw new Error('Function not implemented.')
                            }}
                            loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                        />
                        <AttributeInput attribute={roleAttr} constraints={roleConstraints} register={register} error={''} isSubmitted={false} />
                        <AttributeInput
                            attribute={checkBox1Attribute}
                            constraints={roleConstraints}
                            register={register}
                            error={''}
                            isSubmitted={false}
                        />
                        <div className={styles.marginVertical20}>
                            <AttributeInput
                                attribute={checkBox2Attribute}
                                constraints={roleConstraints}
                                register={register}
                                error={''}
                                isSubmitted={false}
                            />
                        </div>
                        <AttributeInput
                            attribute={checkBox3Attribute}
                            constraints={roleConstraints}
                            register={register}
                            error={''}
                            isSubmitted={false}
                        />
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
