import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, IOption, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useFindRelatedOrganizationsHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'

import { GroupFormEnum, createGroupSchema, editGroupSchema } from './groupSchema'

import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'
import { IGroupEditViewParams } from '@/components/containers/standardization/groups/GroupEditContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const GroupCreateEditView: React.FC<IGroupEditViewParams> = ({ onSubmit, goBack, infoData, isEdit, id }) => {
    const { t } = useTranslation()

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(isEdit ? editGroupSchema(t) : createGroupSchema(t)) })

    const orgOptionsHook = useFindRelatedOrganizationsHook()

    const [selectedIdentity, setSelectedIdentity] = useState<string | undefined>(undefined)
    const [organizationOptions, setOrganizationOptions] = useState<IOption[] | undefined>(undefined)

    const watchUser = watch([GroupFormEnum.USER])

    const loadOrgs = useCallback(async (selectedIdentityUuid: string) => {
        await orgOptionsHook(selectedIdentityUuid).then((res) => {
            setOrganizationOptions(
                res.map((org) => {
                    const option: IOption = { value: org.cmdbId ?? '', label: org.attributes?.Gen_Profil_nazov ?? '' }
                    return option
                }),
            )
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        selectedIdentity && loadOrgs(selectedIdentity)
    }, [loadOrgs, selectedIdentity])

    useEffect(() => {
        if (watchUser[0]) {
            setSelectedIdentity(watchUser[0])
        }
    }, [watchUser])

    return (
        <>
            {!isEdit && (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                        { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                        { href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE, label: t('groups.groupList') },
                        {
                            href: NavigationSubRoutes.PRACOVNA_SKUPINA_CREATE,
                            label: t('groups.addNewGroup'),
                        },
                    ]}
                />
            )}
            {isEdit && (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                            { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                            { href: NavigationSubRoutes.PRACOVNA_SKUPINA_DETAIL, label: infoData?.name ?? '' },
                            {
                                href: `${NavigationSubRoutes.PRACOVNA_SKUPINA_EDIT}/${id}/edit`,
                                label: t('groups.editGroup'),
                            },
                        ]}
                    />
                </>
            )}
            <MainContentWrapper>
                <TextHeading size="XL">{isEdit ? `${t('groups.editGroup')} - ${infoData?.name}` : t('groups.addNewGroup')}</TextHeading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label={`${t('groups.groupName')} (${t('groups.mandatory')}):`}
                        id={GroupFormEnum.NAME}
                        {...register(GroupFormEnum.NAME, { value: infoData?.name })}
                        error={errors[GroupFormEnum.NAME]?.message}
                    />
                    <Input
                        label={`${t('groups.shortGroupName')} (${t('groups.mandatory')}):`}
                        id={GroupFormEnum.SHORT_NAME}
                        {...register(GroupFormEnum.SHORT_NAME, { value: infoData?.shortName })}
                        error={errors[GroupFormEnum.SHORT_NAME]?.message}
                    />
                    <TextArea
                        label={`${t('groups.description')} (${t('groups.mandatory')}):`}
                        rows={3}
                        id={GroupFormEnum.DESCRIPTION}
                        {...register(GroupFormEnum.DESCRIPTION, { value: infoData?.description })}
                        error={errors[GroupFormEnum.DESCRIPTION]?.message}
                    />

                    {!isEdit && (
                        <>
                            <IdentitySelect
                                label={`${t('groups.master')} (${t('groups.mandatory')})`}
                                name={GroupFormEnum.USER}
                                setValue={setValue}
                                clearErrors={clearErrors}
                                error={errors[GroupFormEnum.USER]?.message}
                            />
                            <SimpleSelect
                                label={`${t('groups.organization')} (${t('groups.mandatory')}):`}
                                id={GroupFormEnum.ORGANIZATION}
                                name={GroupFormEnum.ORGANIZATION}
                                options={organizationOptions ?? []}
                                setValue={setValue}
                                error={errors[GroupFormEnum.ORGANIZATION]?.message}
                            />
                        </>
                    )}
                    <ButtonGroupRow>
                        <Button label={t('form.cancel')} type="reset" variant="secondary" onClick={goBack} />
                        <Button label={t('form.submit')} type="submit" />
                    </ButtonGroupRow>
                </form>
            </MainContentWrapper>
        </>
    )
}
