import { MultiSelect } from '@isdd/idsk-ui-kit'
import React, { useEffect, useMemo, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ATTRIBUTE_NAME, GET_ENUM } from '@isdd/metais-common/api/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

interface iSelectPersonType<T extends FieldValues> {
    filter: T
    setValue: UseFormSetValue<T>
}

export const SelectPersonType = <T extends FieldValues & IFilterParams>({ filter, setValue }: iSelectPersonType<T>) => {
    const { t } = useTranslation()
    const [seed, setSeed] = useState(1)

    const { data: personTypesCategories } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const optionsPersonType = useMemo(() => {
        return personTypesCategories?.enumItems?.map((enumItem) => ({
            value: `${enumItem.code}`,
            label: `${enumItem.value} - ${enumItem.description}`,
        }))
    }, [personTypesCategories])

    useEffect(() => {
        setSeed(Math.random())
    }, [optionsPersonType])
    return (
        <>
            <MultiSelect
                key={seed}
                name={ATTRIBUTE_NAME.EA_Profil_PO_typ_osoby}
                label={t('filter.PO.publicAuthorityType')}
                placeholder={t('filter.chooseValue')}
                options={optionsPersonType ?? []}
                defaultValue={filter.EA_Profil_PO_typ_osoby}
                setValue={setValue}
            />
        </>
    )
}
