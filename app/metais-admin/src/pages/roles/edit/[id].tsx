import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFindByUuid, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import { BreadCrumbs, Button, HomeIcon, Input, LoadingIndicator, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { FormProvider, useForm } from 'react-hook-form'
import { useGetValidEnum } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'

import { findInputError } from '../formUtils'

const EditRole: React.FC = () => {
    const { id } = useParams()

    const { data: currentRole, isLoading } = useFindByUuid(id ?? '')
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
    const { mutate: updateRole } = useUpdateOrCreate()
    const register = methods.register
    const errors = methods.formState.errors
    const onSubmit = methods.handleSubmit((data) => {
        updateRole({
            data: { name: data['name'], description: data['description'], type: 'NON_SYSTEM', assignedGroup: data['assignedGroup'], uuid: id },
        })
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
            {isLoading && <LoadingIndicator fullscreen />}
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: '/', icon: HomeIcon },
                    { label: t('adminRolesPage.rolesList'), href: '/roles' },
                    { label: t('adminRolesPage.newRole'), href: '/roles/edit/' + id },
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
                        {...register('type')}
                        label="Systemova rola"
                        disabled
                        options={[
                            { value: 'SYSTEM', label: 'ano' },
                            { value: 'NON_SYSTEM', label: 'nie' },
                        ]}
                    />
                    <Button label="Submit" onClick={onSubmit} />
                    <Button label="Cancel" onClick={() => navigate('/roles?system=all&group=all')} variant="secondary" />
                </form>
            </FormProvider>
        </>
    )
}

export default EditRole
