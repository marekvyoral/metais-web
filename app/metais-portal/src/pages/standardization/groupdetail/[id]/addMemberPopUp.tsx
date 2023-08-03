import { BaseModal, Button, ILoadOptionsResponse, SelectLazyLoading, TextHeading } from '@isdd/idsk-ui-kit/index'
import {
    AttributeAttributeTypeEnum,
    CiListFilterContainerUi,
    ConfigurationItemSetUi,
    ConfigurationItemUi,
    useReadCiList1Hook,
} from '@isdd/metais-common/api'
import React, { useCallback, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { MultiValue } from 'react-select'
import { Identity, useFind1Hook, useFindAll3Hook } from '@isdd/metais-common/api/generated/iam-swagger'

import styles from './styles.module.scss'
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
    const { handleSubmit, register, formState } = formMethods
    const loadOrgs = useReadCiList1Hook()
    const loadMembers = useFind1Hook()
    const [selectedMember, setSelectedMember] = useState<Identity>()
    const [selectedOrganization, setSelectedOrganization] = useState<ConfigurationItemUi>()
    const onSubmit = (formData: FieldValues) => {
        console.log('formData', formData)
        console.log('formState', formState)
        setAddedLabel(true)
        onClose()
    }

    const loadMembersOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<Identity>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const queryParams = {
                limit: 50,
                page: page,
            }
            const identities = await loadMembers(queryParams.page, queryParams.limit, { expression: searchQuery })
            return {
                options: identities || [],
                hasMore: identities?.length ? true : false,
                additional: {
                    page,
                },
            }
        },
        [loadMembers],
    )

    const loadOrgOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<ConfigurationItemUi>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const queryParams: CiListFilterContainerUi = {
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
            }
            const hierarchyData = (await loadOrgs(queryParams)).configurationItemSet
            return {
                options: hierarchyData || [],
                hasMore: hierarchyData?.length ? true : false,
                additional: {
                    page,
                },
            }
        },
        [loadOrgs],
    )

    return (
        <>
            <BaseModal isOpen={isOpen} close={onClose}>
                <TextHeading size="L">Pridať člena</TextHeading>
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SelectLazyLoading
                            placeholder="Vyber..."
                            value={selectedMember}
                            onChange={(newValue) => setSelectedMember(newValue as Identity)}
                            label={'Člen (povinné)'}
                            name={'member'}
                            getOptionValue={(item) => item?.uuid ?? ''}
                            getOptionLabel={(item) => item?.firstName + ' ' + item?.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        <SelectLazyLoading
                            placeholder="Vyber..."
                            value={selectedOrganization}
                            onChange={(newValue) => setSelectedOrganization(newValue as ConfigurationItemUi)}
                            label={'Organization (povinné)'}
                            name={'organization'}
                            getOptionLabel={(item) => (item.attributes ?? {})['Gen_Profil_nazov']}
                            getOptionValue={(item) => item.uuid ?? ''}
                            loadOptions={(searchTerm, _, additional) => loadOrgOptions(searchTerm, additional)}
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
