import { MultiSelect } from '@isdd/idsk-ui-kit'
import React, { useEffect, useMemo, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ATTRIBUTE_NAME, GET_ENUM, useGetEnum } from '@isdd/metais-common/api'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

interface iSelectPersonCategory<T extends FieldValues> {
    filter: T
    setValue: UseFormSetValue<T>
}

export const SelectPersonCategory = <T extends FieldValues & IFilterParams>({ filter, setValue }: iSelectPersonCategory<T>) => {
    const { t } = useTranslation()
    const [seed, setSeed] = useState(1)

    const { data: personCategories } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const optionsPersonCategories = useMemo(() => {
        return personCategories?.enumItems?.map((enumItem) => ({
            value: `${enumItem.code}`,
            label: `${enumItem.value} - ${enumItem.description}`,
        }))
    }, [personCategories])

    useEffect(() => {
        setSeed(Math.random())
    }, [optionsPersonCategories])
    return (
        <>
            <MultiSelect
                key={seed}
                name={ATTRIBUTE_NAME.EA_Profil_PO_kategoria_osoby}
                id="persons-category"
                label={t('filter.PO.personsCategory')}
                placeholder={t('filter.chooseValue')}
                options={optionsPersonCategories ?? []}
                defaultValue={filter.EA_Profil_PO_kategoria_osoby}
                setValue={setValue}
            />
        </>
    )
}
