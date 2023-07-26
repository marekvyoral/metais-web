import { BreadCrumbs, Button, HomeIcon, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetValidEnum } from '@isdd/metais-common/api'
import { useNavigate } from 'react-router-dom'
import { useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'

import { findInputError } from './formUtils'

const AddRole: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const methods = useForm()
    const { mutate: createRole } = useUpdateOrCreate()
    const register = methods.register
    const errors = methods.formState.errors
    const onSubmit = methods.handleSubmit((data) => {
        createRole({ data: { name: data['name'], description: data['description'], type: 'NON_SYSTEM', assignedGroup: data['assignedGroup'] } })
    })
    const { data: roleGroups } = useGetValidEnum('SKUPINA_ROL')
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
                    { label: t('notifications.home'), href: '/', icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: '/roles' },
                    { label: t('adminRolesPage.newRole'), href: '/roles/new' },
                ]}
            />
            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} noValidate className="container">
                    <Input
                        label="Name"
                        {...register('name', { required: { value: true, message: 'Required Name' } })}
                        error={findInputError(errors, 'name')?.error?.message?.toString()}
                    />
                    <Input
                        label="Description"
                        {...register('description', { required: { value: true, message: 'Required description' } })}
                        error={findInputError(errors, 'description')?.error?.message?.toString()}
                    />
                    <SimpleSelect
                        {...register('assignedGroup')}
                        id="1"
                        label={'Group'}
                        options={[{ value: '', label: t('adminRolesPage.none') }, ...groups]}
                    />
                    <SimpleSelect
                        label="Systemova rola"
                        disabled
                        options={[
                            { value: 'NON_SYSTEM', label: 'nie' },
                            { value: 'SYSTEM', label: 'ano' },
                        ]}
                    />
                    <Button label="Submit" onClick={onSubmit} />
                    <Button label="Cancel" onClick={() => navigate('/roles?system=all&group=all')} variant="secondary" />
                </form>
            </FormProvider>
        </>
    )
}

export default AddRole
