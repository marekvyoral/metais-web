import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { BreadCrumbs, Button, ButtonGroupRow, ErrorBlock, HomeIcon, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { findInputError, getGroupRoles } from '@/components/views/egov/roles-detail-views/formUtils'
import { IRoleEditViewParams } from '@/components/containers/Egov/Roles/EditRoleContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const RoleEditView: React.FC<IRoleEditViewParams> = ({ currentRole, roleId, updateRole, isLoading, isError, roleGroups }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setValue, register, formState, handleSubmit } = useForm({
        defaultValues: {
            name: currentRole?.name,
            description: currentRole?.description,
            assignedGroup: currentRole?.assignedGroup,
            type: currentRole?.type,
        },
        mode: 'onChange',
    })

    const errors = formState.errors
    const onSubmit = handleSubmit((data) => {
        updateRole({
            data: {
                name: data.name,
                description: data.description,
                type: RelatedRoleType.NON_SYSTEM,
                assignedGroup: data.assignedGroup,
                uuid: roleId,
            },
        })
    })

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('navbar.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_EDIT + '/' + roleId },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false}>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{t('adminRolesPage.editRole')}</TextHeading>
                        {isError && <QueryFeedback error loading={false} />}
                    </FlexColumnReverseWrapper>

                    {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                    <form onSubmit={onSubmit} noValidate>
                        <Input
                            label={t('adminRolesPage.name')}
                            {...register('name', { required: { value: true, message: t('adminRolesPage.requiredName') } })}
                            defaultValue={currentRole?.name}
                            error={findInputError(errors, 'name')?.error?.message?.toString()}
                        />
                        <Input
                            label={t('adminRolesPage.description')}
                            {...register('description', { required: { value: true, message: t('adminRolesPage.requiredDesc') } })}
                            defaultValue={currentRole?.description}
                            error={findInputError(errors, 'description')?.error?.message?.toString()}
                        />
                        <SimpleSelect
                            setValue={setValue}
                            id="assignedGroup"
                            name="assignedGroup"
                            label={t('adminRolesPage.group')}
                            options={[{ value: '', label: t('adminRolesPage.none') }, ...getGroupRoles(roleGroups)]}
                            defaultValue={currentRole?.assignedGroup}
                        />
                        <SimpleSelect
                            setValue={setValue}
                            name="systemRole"
                            label={t('adminRolesPage.systemRole')}
                            disabled
                            options={[
                                { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                                { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                            ]}
                            defaultValue={currentRole?.type}
                        />
                        <ButtonGroupRow>
                            <Button label={t('adminRolesPage.submit')} type="submit" />
                            <Button
                                label={t('adminRolesPage.cancel')}
                                onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all', { state: { from: location } })}
                                variant="secondary"
                            />
                        </ButtonGroupRow>
                    </form>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
