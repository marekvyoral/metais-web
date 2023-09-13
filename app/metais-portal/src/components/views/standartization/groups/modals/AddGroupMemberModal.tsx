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
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'

import { AddMemberEnum, addMemberSchema } from './addMemberSchema'

import styles from '@/components/views/standartization/groups/styles.module.scss'
import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standartization/groups/defaultRoles'

const proffesionalsUuid = '1734e40c-f959-4629-a699-5c0bc6ba8d55'

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

    const findRole = useFindAll11Hook()
    const addRelation = useAddGroupOrgRoleIdentityRelationHook()
    const [addingGroupMember, setAddingGroupMember] = useState<boolean>(false)
    const watchMember = watch(['member'])

    const [selectedMemberOrganizations, setSelectedMemberOrganizations] = useState<{ name: string; uuid: string }[]>([
        { uuid: proffesionalsUuid, name: t('groups.professionals') },
    ])
    const { data: relatedOrganizations } = useFindRelatedOrganizations(watchMember[0] ?? '')

    const onSubmit = async (form: FieldValues) => {
        setAddingGroupMember(true)
        const role = (await findRole({ name: form.role })) as Role
        await addRelation(form.identity ?? '', group?.uuid ?? '', role.uuid ?? '', form.organization)
        setAddingGroupMember(false)
        setAddedLabel(true)
        onClose()
    }

    useEffect(() => {
        setSelectedMemberOrganizations([
            ...(relatedOrganizations ?? []).map((item) => ({
                uuid: item.cmdbId ?? '',
                name: (item.attributes ?? {})['Gen_Profil_nazov'],
            })),
            { uuid: proffesionalsUuid, name: t('groups.professionals') },
        ])
    }, [relatedOrganizations, t])

    return (
        <>
            <BaseModal
                isOpen={isOpen}
                close={() => {
                    onClose()
                }}
            >
                <TextHeading size="L">{t('groups.addMember')}</TextHeading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IdentitySelect
                        label={t('groups.member')}
                        name={AddMemberEnum.MEMBER}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        error={errors[AddMemberEnum.MEMBER]?.message}
                    />
                    <SimpleSelect
                        label={t('groups.organization')}
                        name={AddMemberEnum.ORGANIZATION}
                        options={selectedMemberOrganizations?.map((item) => ({ label: item.name, value: item.uuid })) ?? []}
                        disabled={!relatedOrganizations}
                        setValue={setValue}
                        clearErrors={clearErrors}
                    />
                    {errors[AddMemberEnum.ORGANIZATION]?.message}
                    <SimpleSelect
                        label={t('groups.role')}
                        name={AddMemberEnum.ROLE}
                        options={(group?.shortName === KSIVS_SHORT_NAME ? DEFAULT_KSISVS_ROLES : DEFAULT_ROLES)?.map((item) => ({
                            label: item.value,
                            value: item.code,
                        }))}
                        error={errors.role ? t('validation.required') : undefined}
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
                        <CheckBox id={AddMemberEnum.ADD_TO_POLLS} label={t('groups.addToOngoingPolls')} {...register(AddMemberEnum.ADD_TO_POLLS)} />
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
            </BaseModal>
        </>
    )
}
export default AddGroupMemberModal
