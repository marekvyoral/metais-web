import React, { FC, useEffect, useState, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { UseFormSetValue } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import style from './customFilterAttribute.module.scss'

import { IAttributeFilters, IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { DynamicFilterAttributeRow } from '@isdd/metais-common/components/dynamicFilterAttributeRow/DynamicFilterAttributeRow'

export interface FilterAttribute {
    value?: string
    operator?: string
    name?: string
}

export interface ColumnAttribute {
    name: string
}

interface Props {
    data?: IAttributeFilters
    setValue: UseFormSetValue<IFilterParams>
    availableAttributes?: ColumnAttribute[]
}

export const DynamicFilterAttributes: FC<Props> = ({ data = {}, setValue, availableAttributes }) => {
    const [dynamicAttributes, setDynamicAttributes] = useState<FilterAttribute[]>([])
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        // this should happend only on mount is one time thing which restore params from url
        const attributes: FilterAttribute[] = []
        Object.keys(data).forEach((name) => {
            data[name].forEach((attr) => {
                attributes.push({ name, operator: attr.operator, value: attr.value })
                setValue(`${name}--${attr.operator}`, attr.value)
            })
        })
        setDynamicAttributes(attributes)
        // eslint-disable-next-line
    }, [])

    const removeAttrRow = (index: number, attribute: FilterAttribute) => {
        const copyAttribute = [...dynamicAttributes]
        const formName: `${string}--${string}` = `${attribute.name}--${attribute.operator}`
        copyAttribute.splice(index, 1)
        setDynamicAttributes(copyAttribute)
        setValue(formName, '')
        if (searchParams.get(formName)) {
            searchParams.delete(formName)
            setSearchParams(searchParams)
        }
    }

    const handleAttrChange = (index: number, attr: FilterAttribute, prevData?: FilterAttribute) => {
        const copyAttribute = [...dynamicAttributes]
        copyAttribute[index] = attr
        setDynamicAttributes(copyAttribute)
        if (attr.name && attr.operator && attr.value) {
            setValue(`${attr.name}--${attr.operator}`, attr.value)
        }
        if (prevData?.name && prevData?.operator) {
            setValue(`${prevData.name}--${prevData.operator}`, undefined)
        }
    }

    const addRow = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setDynamicAttributes([...dynamicAttributes, { value: '', operator: '', name: '' }])
    }
    return (
        <div>
            {dynamicAttributes.map((attribute, index) => {
                return (
                    <DynamicFilterAttributeRow
                        key={`custom-attribute-${index}`}
                        index={index}
                        availableAttributes={availableAttributes}
                        selectedAttributes={dynamicAttributes}
                        remove={() => removeAttrRow(index, attribute)}
                        onChange={(attr, prevData) => handleAttrChange(index, attr, prevData)}
                        value={attribute}
                    />
                )
            })}
            <ButtonLink label={t('customAttributeFilter.add')} className={style.addButton} type="button" onClick={addRow} />
        </div>
    )
}
