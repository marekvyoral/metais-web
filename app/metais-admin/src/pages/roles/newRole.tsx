import { BreadCrumbs, Button, HomeIcon, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetValidEnum } from '@isdd/metais-common/api'
import { useNavigate } from 'react-router-dom'
import { RelatedRoleType, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import { AdminRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { findInputError } from './formUtils'

import { RolesGroup } from '.'

const AddRole: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const methods = useForm()
    const { mutate: createRole } = useUpdateOrCreate()
    const register = methods.register
    const errors = methods.formState.errors
    const onSubmit = methods.handleSubmit((data) => {
        createRole({
            data: { name: data['name'], description: data['description'], type: RelatedRoleType.NON_SYSTEM, assignedGroup: data['assignedGroup'] },
        })
    })
    const { data: roleGroups } = useGetValidEnum(RolesGroup)
    const [tableRoleGroups, setTableRoleGroups] = useState(roleGroups)
    useEffect(() => {
        setTableRoleGroups(roleGroups)
    }, [roleGroups])

    const groups: { value: string; label: string }[] =
        tableRoleGroups?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.value ?? '' })) ?? []
    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: AdminRouteNames.ROLES },
                    { label: t('adminRolesPage.newRole'), href: AdminRouteNames.ROLE_NEW },
                ]}
            />
            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} noValidate className="container">
                    <Input
                        label={t('adminRolesPage.name')}
                        {...register('name', { required: { value: true, message: 'Required Name' } })}
                        error={findInputError(errors, 'name')?.error?.message?.toString()}
                    />
                    <Input
                        label={t('adminRolesPage.description')}
                        {...register('description', { required: { value: true, message: 'Required description' } })}
                        error={findInputError(errors, 'description')?.error?.message?.toString()}
                    />
                    <SimpleSelect
                        {...register('assignedGroup')}
                        id="1"
                        label={t('adminRolesPage.group')}
                        options={[{ value: '', label: t('adminRolesPage.none') }, ...groups]}
                    />
                    <SimpleSelect
                        label={t('adminRolesPage.systemRole')}
                        disabled
                        options={[
                            { value: RelatedRoleType.NON_SYSTEM, label: t('adminRolesPage.no') },
                            { value: RelatedRoleType.SYSTEM, label: t('adminRolesPage.yes') },
                        ]}
                    />
                    <Button label="Submit" onClick={onSubmit} />
                    <Button label="Cancel" onClick={() => navigate(AdminRouteNames.ROLES + '?system=all&group=all')} variant="secondary" />
                </form>
            </FormProvider>
        </>
    )
}

export default AddRole
