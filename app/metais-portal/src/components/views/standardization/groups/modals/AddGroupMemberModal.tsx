import { BaseModal, CheckBox, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import {
    Group,
    Role,
    useAddGroupOrgRoleIdentityRelationHook,
    useFindAll11Hook,
    useFindRelatedOrganizations,
} from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { useReadConfigurationItemByMetaIsCode } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { KSIVS_SHORT_NAME, PUBLIC_ORG_CMDB_CODE } from '@isdd/metais-common/constants'
import { useInvalidateGroupMembersCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { AddMemberEnum, addMemberSchema } from './addMemberSchema'

import { AddMemberSelect } from '@/components/views/standardization/groups/components/AddMemberSelect'
import styles from '@/components/views/standardization/groups/styles.module.scss'
import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standardization/groups/defaultRoles'

interface AddGroupMemberModalProps {
    isOpen: boolean
    onClose: () => void
    setAddedLabel: React.Dispatch<React.SetStateAction<boolean>>
    group: Group | undefined
}

const AddGroupMemberModal: React.FC<AddGroupMemberModalProps> = ({ isOpen, onClose, setAddedLabel, group }) => {
    const { t } = useTranslation()
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(addMemberSchema(t)) })
    const { data: profs } = useReadConfigurationItemByMetaIsCode(PUBLIC_ORG_CMDB_CODE)

    const findRole = useFindAll11Hook()
    const addRelation = useAddGroupOrgRoleIdentityRelationHook()
    const [addingGroupMember, setAddingGroupMember] = useState<boolean>(false)
    const [addingGroupMemberError, setAddingGroupMemberError] = useState<string>()
    const watchMember = watch(['member'])

    const [selectedMemberOrganizations, setSelectedMemberOrganizations] = useState<{ name: string; uuid: string }[]>([])
    const { data: relatedOrganizations } = useFindRelatedOrganizations(watchMember[0] ?? '')

    const invalidateGroupMembersCache = useInvalidateGroupMembersCache(group?.uuid ?? '')

    const onCloseModal = () => {
        onClose()
        setAddingGroupMemberError(undefined)
        setAddingGroupMember(false)
    }

    const onSubmit = async (form: FieldValues) => {
        setAddingGroupMember(true)
        const role = (await findRole({ name: form.role })) as Role
        await addRelation(form.member ?? '', group?.uuid ?? '', role.uuid ?? '', form.organization)
            .then(() => {
                setAddingGroupMember(false)
                setAddedLabel(true)
                invalidateGroupMembersCache.invalidate()
                onClose()
            })
            .catch((resp) => {
                setAddingGroupMember(false)
                setAddingGroupMemberError(JSON.parse(resp.message).message)
            })
    }

    useEffect(() => {
        setSelectedMemberOrganizations([
            ...(relatedOrganizations ?? []).map((item) => ({
                uuid: item.cmdbId ?? '',
                name: (item.attributes ?? {})['Gen_Profil_nazov'],
            })),
            { uuid: profs?.uuid ?? '', name: t('groups.professionals') },
        ])
    }, [profs, relatedOrganizations, t])

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                close={() => {
                    onCloseModal()
                }}
            >
                <TextHeading size="L">{t('groups.addMember')}</TextHeading>
                {addingGroupMemberError && <MutationFeedback success={!addingGroupMemberError} error={addingGroupMemberError} />}
                <QueryFeedback loading={addingGroupMember} withChildren>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AddMemberSelect
                            label={t('groups.member')}
                            name={AddMemberEnum.MEMBER}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            error={errors[AddMemberEnum.MEMBER]?.message}
                            groupUuid={group?.uuid ?? ''}
                        />
                        <SimpleSelect
                            label={t('groups.organization')}
                            name={AddMemberEnum.ORGANIZATION}
                            options={selectedMemberOrganizations?.map((item) => ({ label: item.name, value: item.uuid })) ?? []}
                            disabled={!relatedOrganizations}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            error={errors[AddMemberEnum.ORGANIZATION]?.message}
                        />
                        <SimpleSelect
                            label={t('groups.role')}
                            name={AddMemberEnum.ROLE}
                            options={(group?.shortName === KSIVS_SHORT_NAME ? DEFAULT_KSISVS_ROLES : DEFAULT_ROLES)?.map((item) => ({
                                label: item.value,
                                value: item.code,
                            }))}
                            error={errors[AddMemberEnum.ROLE]?.message}
                            setValue={setValue}
                            clearErrors={clearErrors}
                        />
                        <div className={styles.checkboxWrapper}>
                            <CheckBox
                                id={AddMemberEnum.ADD_TO_SESSIONS}
                                label={t('groups.addToOngoingSession')}
                                {...register(AddMemberEnum.ADD_TO_SESSIONS)}
                            />
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <CheckBox
                                id={AddMemberEnum.ADD_TO_POLLS}
                                label={t('groups.addToOngoingPolls')}
                                {...register(AddMemberEnum.ADD_TO_POLLS)}
                            />
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <CheckBox
                                id={AddMemberEnum.CAN_SEE_EMAILS}
                                label={t('groups.seeEmailAddresses')}
                                {...register(AddMemberEnum.CAN_SEE_EMAILS)}
                            />
                        </div>
                        <SubmitWithFeedback submitButtonLabel={t('groups.addingMember')} loading={addingGroupMember} />
                    </form>
                </QueryFeedback>
            </BaseModal>
        </>
    )
}
export default AddGroupMemberModal
