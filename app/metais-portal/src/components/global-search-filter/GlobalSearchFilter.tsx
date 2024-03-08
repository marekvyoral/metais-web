import React from 'react'
import StickyBox from 'react-sticky-box'
import classNames from 'classnames'
import { AccordionContainer, Button, CheckBox, IAccordionSection, RadioButton, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import globalStyles from '@isdd/metais-common/src/components/GridView.module.scss'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import styles from './globalSearchFilter.module.scss'

enum GlobalSearchFilterFormNames {
    TODAY = 'today',
    THIS_WEEK = 'thisWeek',
    THIS_MONTH = 'thisMonth',
    THIS_YEAR = 'thisYear',
    CUSTOM_RANGE = 'customRange',
    FROM_UPDATE = 'fromUpdate',
    TO_UPDATE = 'toUpdate',
    ATTRIBUTE = 'attribute',
    DOCUMENT = 'document',
    OBJECT = 'object',
    RELATION = 'relation',
    ALL = 'all',
    OWNER = 'owner',
    PDF = 'pdf',
    DOCX = 'docx',
    RTF = 'rtf',
    OTD = 'otd',
}

export const GlobalSearchFilter = () => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue, clearErrors, control } = useForm()

    const onSubmit = (formData: FieldValues) => {
        // eslint-disable-next-line no-console
        console.warn(formData)
    }

    const sections: IAccordionSection[] = [
        {
            title: t('globalSearch.filter.updateDate'),
            content: (
                <>
                    <div className={classNames('govuk-radios govuk-radios--small', styles.marginBottom)}>
                        <RadioButton
                            label={t('globalSearch.filter.today')}
                            id={GlobalSearchFilterFormNames.TODAY}
                            value={GlobalSearchFilterFormNames.TODAY}
                            {...register(GlobalSearchFilterFormNames.TODAY)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.thisWeek')}
                            id={GlobalSearchFilterFormNames.THIS_WEEK}
                            value={GlobalSearchFilterFormNames.THIS_WEEK}
                            {...register(GlobalSearchFilterFormNames.THIS_WEEK)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.thisMonth')}
                            id={GlobalSearchFilterFormNames.THIS_MONTH}
                            value={GlobalSearchFilterFormNames.THIS_MONTH}
                            {...register(GlobalSearchFilterFormNames.THIS_MONTH)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.thisYear')}
                            id={GlobalSearchFilterFormNames.THIS_YEAR}
                            value={GlobalSearchFilterFormNames.THIS_YEAR}
                            {...register(GlobalSearchFilterFormNames.THIS_YEAR)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.customRange')}
                            id={GlobalSearchFilterFormNames.CUSTOM_RANGE}
                            value={GlobalSearchFilterFormNames.CUSTOM_RANGE}
                            className={styles.floatInitial}
                            {...register(GlobalSearchFilterFormNames.CUSTOM_RANGE)}
                        />
                    </div>
                    <DateInput
                        label={t('globalSearch.filter.fromUpdate')}
                        {...register(GlobalSearchFilterFormNames.FROM_UPDATE)}
                        control={control}
                        setValue={setValue}
                    />
                    <DateInput
                        label={t('globalSearch.filter.toUpdate')}
                        {...register(GlobalSearchFilterFormNames.TO_UPDATE)}
                        control={control}
                        setValue={setValue}
                    />
                </>
            ),
            summary: t('globalSearch.filter.selected', { count: 1 }),
        },
        {
            title: t('globalSearch.filter.resultType'),
            content: (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label={t('globalSearch.filter.attribute')}
                        id={GlobalSearchFilterFormNames.ATTRIBUTE}
                        {...register(GlobalSearchFilterFormNames.ATTRIBUTE)}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.document')}
                        id={GlobalSearchFilterFormNames.DOCUMENT}
                        {...register(GlobalSearchFilterFormNames.DOCUMENT)}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.object')}
                        id={GlobalSearchFilterFormNames.OBJECT}
                        {...register(GlobalSearchFilterFormNames.OBJECT)}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.relation')}
                        id={GlobalSearchFilterFormNames.RELATION}
                        {...register(GlobalSearchFilterFormNames.RELATION)}
                        containerClassName={styles.floatInitial}
                    />
                </div>
            ),
            summary: t('globalSearch.filter.selected', { count: 1 }),
        },
        {
            title: t('globalSearch.filter.section'),
            content: (
                //I think this will be generated based on new API
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label={t('globalSearch.filter.all')}
                        id={GlobalSearchFilterFormNames.ALL}
                        {...register(GlobalSearchFilterFormNames.ALL)}
                    />
                    <CheckBox label="eGov" id={'egov'} {...register('egov')} />
                    <CheckBox label="standardization" id={'standardization'} {...register('standardization')} />
                    <CheckBox label="guides" id={'guides'} {...register('guides')} containerClassName={styles.floatInitial} />
                </div>
            ),
            summary: t('globalSearch.filter.selected', { count: 1 }),
        },
        {
            title: t('globalSearch.filter.owner'),
            content: (
                <SimpleSelect
                    label=""
                    options={DEFAULT_PAGESIZE_OPTIONS}
                    name={GlobalSearchFilterFormNames.OWNER}
                    setValue={setValue}
                    clearErrors={clearErrors}
                />
            ),
            summary: t('globalSearch.filter.selected', { count: 1 }),
        },
        {
            title: t('globalSearch.filter.documentType'),
            content: (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label={t('globalSearch.filter.pdf')}
                        id={GlobalSearchFilterFormNames.PDF}
                        {...register(GlobalSearchFilterFormNames.PDF)}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.docx')}
                        id={GlobalSearchFilterFormNames.DOCX}
                        {...register(GlobalSearchFilterFormNames.DOCX)}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.rtf')}
                        id={GlobalSearchFilterFormNames.RTF}
                        {...register(GlobalSearchFilterFormNames.RTF)}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.otd')}
                        id={GlobalSearchFilterFormNames.OTD}
                        {...register(GlobalSearchFilterFormNames.OTD)}
                        containerClassName={styles.floatInitial}
                    />
                </div>
            ),
            summary: t('globalSearch.filter.selected', { count: 1 }),
        },
    ]

    return (
        <StickyBox className={classNames(globalStyles.sidebarContainer, styles.marginLeft)}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={classNames('govuk-!-font-size-19', globalStyles.sectionsContainer, styles.noPaddingTop)}
                noValidate
            >
                <AccordionContainer isSmall shouldNotUnMountContent sections={sections} />
                <Button type="submit" className={styles.button} variant="secondary" label={t('globalSearch.filter.submitButton')} />
            </form>
        </StickyBox>
    )
}
