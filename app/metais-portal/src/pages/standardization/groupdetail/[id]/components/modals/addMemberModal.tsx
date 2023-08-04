import { BaseModal, Button, ILoadOptionsResponse, SelectLazyLoading, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { AttributeAttributeTypeEnum, Role } from '@isdd/metais-common/api'
import {
    Identity,
    useAddGroupOrgRoleIdentityRelationHook,
    useFind1Hook,
    useFindAll11Hook,
    useFindRelatedOrganizationsHook,
} from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { DEFAULT_ROLES } from '../../defaultRoles'
import styles from '../../styles.module.scss'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'

const textAttribute = {
    constraints: [{ type: 'enum', enumCode: 'SPOLOCNE_MODULY' }],
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
    groupId: string
}

const KSIVSAddMemberPopUp: React.FC<addMemberPopUpProps> = ({ isOpen, onClose, setAddedLabel, groupId }) => {
    const formMethods = useForm()
    const { handleSubmit, register } = formMethods
    const loadMembers = useFind1Hook()
    const findRole = useFindAll11Hook()
    const addRelation = useAddGroupOrgRoleIdentityRelationHook()
    const getOrganizationsByUser = useFindRelatedOrganizationsHook()
    const [selectedMember, setSelectedMember] = useState<Identity>()
    const [selectedOrganization, setSelectedOrganization] = useState<string>()
    const [selectedRole, setSelectedRole] = useState<string>()
    const [errors, setErrors] = useState<string[]>([])
    const [selectedMemberOrganizations, setSelectedMemberOrganizations] = useState<{ name: string; uuid: string }[]>()

    const onSubmit = async () => {
        if (selectedRole == undefined && !errors.includes('role')) {
            setErrors([...errors, 'role'])
        }
        if (selectedOrganization == undefined && !errors.includes('organization')) {
            setErrors([...errors, 'organization'])
        }
        if (selectedMember == undefined && !errors.includes('member')) {
            setErrors([...errors, 'member'])
        }
        if (selectedMember != undefined && selectedOrganization != undefined && selectedRole != undefined) {
            const role = (await findRole({ name: selectedRole })) as Role
            await addRelation(selectedMember.uuid ?? '', groupId, role.uuid ?? '', selectedOrganization)
            setAddedLabel(true)
            onClose()
        }
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

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                close={() => {
                    onClose()
                    setErrors([])
                }}
            >
                <TextHeading size="L">Pridať člena</TextHeading>
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SelectLazyLoading
                            error={errors.includes('member') ? 'Vyberte clena' : ''}
                            placeholder="Vyber..."
                            value={selectedMember}
                            onChange={async (newValue) => {
                                setSelectedMember(newValue as Identity)
                                if (selectedMember != undefined) {
                                    const organizationsForUser: { name: string; uuid: string }[] = await getOrganizationsByUser(
                                        selectedMember?.uuid ?? '',
                                    ).then((response) =>
                                        response.map((item) => ({
                                            uuid: item.uuid ?? '',
                                            name: (item.attributes ?? {})['Gen_Profil_nazov'],
                                        })),
                                    )
                                    setSelectedMemberOrganizations([
                                        ...organizationsForUser,
                                        { uuid: '1734e40c-f959-4629-a699-5c0bc6ba8d55', name: 'Odborna verejnost' },
                                    ])
                                }
                                setErrors(errors.filter((item) => item !== 'member'))
                            }}
                            label={'Člen (povinné)'}
                            name={'member'}
                            getOptionValue={(item) => item?.uuid ?? ''}
                            getOptionLabel={(item) => item?.firstName + ' ' + item?.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        <SimpleSelect
                            label="Organization (povinné)"
                            options={selectedMemberOrganizations?.map((item) => ({ label: item.name, value: item.uuid })) ?? []}
                            disabled={selectedMember == undefined}
                            onChange={(value) => {
                                setSelectedOrganization(value.target.value)
                                if (selectedOrganization != undefined) {
                                    setErrors(errors.filter((item) => item !== 'organization'))
                                }
                            }}
                            error={errors.includes('organization') ? 'Vyberte organizaciu' : ''}
                        />
                        <SimpleSelect
                            label="Rola (povinné)"
                            options={DEFAULT_ROLES?.map((item) => ({ label: item.value, value: item.code }))}
                            error={errors.includes('role') ? 'Vyberte rolu' : ''}
                            onChange={(value) => {
                                setSelectedRole(value.target.value)
                                setErrors(errors.filter((item) => item !== 'role'))
                            }}
                        />
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
