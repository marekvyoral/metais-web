import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RelatedRoleType } from '@isdd/metais-common/api/generated/iam-swagger'
import { BreadCrumbs, Button, HomeIcon, Input, LoadingIndicator, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { findInputError, getGroupRoles } from '@/components/views/egov/roles-detail-views/formUtils'
import { RoleEditViewParams } from '@/components/containers/Egov/Roles/EditEntityContainer'

const RoleEditView: React.FC<RoleEditViewParams> = ({ currentRole, roleId, updateRole, isLoading, roleGroups }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
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
            {isLoading && <LoadingIndicator fullscreen />}
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_EDIT + '/' + roleId },
                ]}
            />
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
                        {...register('assignedGroup')}
                        id="assignedGroup"
                        label={t('adminRolesPage.group')}
                        options={[{ value: '', label: t('adminRolesPage.none') }, ...getGroupRoles(tableRoleGroups)]}
                    />
                    <SimpleSelect
                        {...register('type')}
                        label={t('adminRolesPage.systemRole')}
                        disabled
                        options={[
                            { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                            { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                        ]}
                    />
                    <Button label="Submit" onClick={onSubmit} />
                    <Button label="Cancel" onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all')} variant="secondary" />
                </form>
            </FormProvider>
        </>
    )
}

export default RoleEditView
