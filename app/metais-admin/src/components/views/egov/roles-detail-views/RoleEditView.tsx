import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FormProvider, useForm } from 'react-hook-form'
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
    const methods = useForm({
        defaultValues: {
            name: currentRole?.name,
            description: currentRole?.description,
            assignedGroup: currentRole?.assignedGroup,
            type: currentRole?.type,
        },
        values: currentRole,
    })
    const register = methods.register
    const errors = methods.formState.errors
    const onSubmit = methods.handleSubmit((data) => {
        updateRole({
            data: {
                name: data['name'],
                description: data['description'],
                type: RelatedRoleType.NON_SYSTEM,
                assignedGroup: data['assignedGroup'],
                uuid: roleId,
            },
        })
    })
    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)
    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

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
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{t('adminRolesPage.newRole')}</TextHeading>
                        {isError && <QueryFeedback error loading={false} />}
                    </FlexColumnReverseWrapper>
                    <FormProvider {...methods}>
                        <form onSubmit={(e) => e.preventDefault()} noValidate className="container">
                            <Input
                                label={t('adminRolesPage.name')}
                                {...register('name', { required: { value: true, message: t('adminRolesPage.requiredName') } })}
                                error={findInputError(errors, 'name')?.error?.message?.toString()}
                            />
                            <Input
                                label={t('adminRolesPage.description')}
                                {...register('description', { required: { value: true, message: t('adminRolesPage.requiredDesc') } })}
                                error={findInputError(errors, 'description')?.error?.message?.toString()}
                            />
                            <SimpleSelect
                                setValue={methods.setValue}
                                id="assignedGroup"
                                name="assignedGroup"
                                label={t('adminRolesPage.group')}
                                options={[{ value: '', label: t('adminRolesPage.none') }, ...getGroupRoles(tableRoleGroups)]}
                                defaultValue={currentRole?.assignedGroup}
                            />
                            <SimpleSelect
                                setValue={methods.setValue}
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
                                <Button label="Submit" onClick={onSubmit} />
                                <Button
                                    label="Cancel"
                                    onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all', { state: { from: location } })}
                                    variant="secondary"
                                />
                            </ButtonGroupRow>
                        </form>
                    </FormProvider>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
