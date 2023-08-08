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
import { useTranslation } from 'react-i18next'

import { DEFAULT_ROLES } from '../defaultRoles'
import styles from '../styles.module.scss'
import { hasAttributeInputError } from '../standartizationUtils'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'

const textAttribute = {
    constraints: [{ type: 'enum', enumCode: 'SPOLOCNE_MODULY' }],
}

const ongoingSessionCheckboxAttr = {
    ...textAttribute,
    name: 'Pridať do prebiehajúcich zasadnutí',
    technicalName: 'checkbox1',
    attributeTypeEnum: AttributeAttributeTypeEnum.BOOLEAN,
}

const ongoingPollsCheckboxAttr = {
    ...textAttribute,
    name: 'Pridať do prebiehajúcich hlasovaní',
    technicalName: 'checkbox2',
    attributeTypeEnum: AttributeAttributeTypeEnum.BOOLEAN,
}

const seeEmailsCheckboxAttr = {
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
    const { handleSubmit, register, formState, setValue, trigger, control } = useForm({})
    const { t } = useTranslation()
    const loadMembers = useFind1Hook()
    const findRole = useFindAll11Hook()
    const addRelation = useAddGroupOrgRoleIdentityRelationHook()
    const getOrganizationsByUser = useFindRelatedOrganizationsHook()
    const [selectedMember, setSelectedMember] = useState<Identity>()
    const [selectedOrganization, setSelectedOrganization] = useState<string>()
    const [selectedRole, setSelectedRole] = useState<string>()
    const [myErrors, setMyErrors] = useState<string[]>([])
    const [selectedMemberOrganizations, setSelectedMemberOrganizations] = useState<{ name: string; uuid: string }[]>()

    const onSubmit = async () => {
        if (selectedRole == undefined && !myErrors.includes('role')) {
            setMyErrors([...myErrors, 'role'])
        }
        if (selectedOrganization == undefined && !myErrors.includes('organization')) {
            setMyErrors([...myErrors, 'organization'])
        }
        if (selectedMember == undefined && !myErrors.includes('member')) {
            setMyErrors([...myErrors, 'member'])
        }
        if (selectedMember != undefined && selectedOrganization != undefined && selectedRole != undefined) {
            const role = (await findRole({ name: selectedRole })) as Role
            await addRelation(selectedMember.uuid ?? '', groupId, role.uuid ?? '', selectedOrganization)
            setAddedLabel(true)
            onClose()
        }
    }
    const { errors, isSubmitted } = formState

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
                    setMyErrors([])
                }}
            >
                <TextHeading size="L">{t('KSIVSPage.addMember')}</TextHeading>
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SelectLazyLoading
                            error={myErrors.includes('member') ? t('KSIVSPage.selectMember') : ''}
                            placeholder={t('KSIVSPage.select')}
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
                                        { uuid: '1734e40c-f959-4629-a699-5c0bc6ba8d55', name: t('KSIVSPage.professionals') },
                                    ])
                                }
                                setMyErrors(myErrors.filter((item) => item !== 'member'))
                            }}
                            label={t('KSIVSPage.memberMandatory')}
                            name={'member'}
                            getOptionValue={(item) => item?.uuid ?? ''}
                            getOptionLabel={(item) => item?.firstName + ' ' + item?.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        <SimpleSelect
                            label={t('KSIVSPage.organizationMandatory')}
                            options={selectedMemberOrganizations?.map((item) => ({ label: item.name, value: item.uuid })) ?? []}
                            disabled={selectedMember == undefined}
                            onChange={(value) => {
                                setSelectedOrganization(value.target.value)
                                if (selectedOrganization != undefined) {
                                    setMyErrors(myErrors.filter((item) => item !== 'organization'))
                                }
                            }}
                            error={myErrors.includes('organization') ? t('KSIVSPage.selectOrganization') : ''}
                        />
                        <SimpleSelect
                            label={t('KSIVSPage.roleMandatory')}
                            options={DEFAULT_ROLES?.map((item) => ({ label: item.value, value: item.code }))}
                            error={myErrors.includes('role') ? t('KSIVSPage.selectRole') : ''}
                            onChange={(value) => {
                                setSelectedRole(value.target.value)
                                setMyErrors(myErrors.filter((item) => item !== 'role'))
                            }}
                        />
                        <AttributeInput
                            control={control}
                            trigger={trigger}
                            setValue={setValue}
                            attribute={{ ...ongoingSessionCheckboxAttr, name: t('KSIVSPage.addToOngoingSession') }}
                            constraints={roleConstraints}
                            register={register}
                            error={hasAttributeInputError(ongoingSessionCheckboxAttr, errors)}
                            isSubmitted={isSubmitted}
                        />
                        <div className={styles.marginVertical20}>
                            <AttributeInput
                                control={control}
                                trigger={trigger}
                                setValue={setValue}
                                attribute={{ ...ongoingPollsCheckboxAttr, name: t('KSIVSPage.addToOngoingPolls') }}
                                constraints={roleConstraints}
                                register={register}
                                error={hasAttributeInputError(ongoingPollsCheckboxAttr, errors)}
                                isSubmitted={isSubmitted}
                            />
                        </div>
                        <AttributeInput
                            control={control}
                            trigger={trigger}
                            setValue={setValue}
                            attribute={{ ...seeEmailsCheckboxAttr, name: t('KSIVSPage.seeEmailAddresses') }}
                            constraints={roleConstraints}
                            register={register}
                            error={hasAttributeInputError(seeEmailsCheckboxAttr, errors)}
                            isSubmitted={isSubmitted}
                        />
                        <div style={{ display: 'flex' }}>
                            <Button label={t('KSIVSPage.addMember')} type="submit" className={styles.marginLeftAuto} />
                        </div>
                    </form>
                </FormProvider>
            </BaseModal>
        </>
    )
}
export default KSIVSAddMemberPopUp
