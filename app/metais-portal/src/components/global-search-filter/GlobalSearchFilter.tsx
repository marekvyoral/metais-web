import StickyBox from 'react-sticky-box'
import classNames from 'classnames'
import { AccordionContainer, Button, CheckBox, IAccordionSection, RadioButton, RadioGroup } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, PO } from '@isdd/metais-common/constants'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import globalStyles from '@isdd/metais-common/src/components/GridView.module.scss'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { useSearchParams } from 'react-router-dom'
import {
    PortalSearchDmsDocumentExtensionsItem,
    PortalSearchResultTypesItem,
    PortalSearchSectionsItem,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'

import styles from './globalSearchFilter.module.scss'

import { CustomDateRange, DateRanges, GlobalSearchSubSections, IGlobalSearchForm, deserializeParams } from '@/componentHelpers/global-search'

const defaultFormValue = {
    [GlobalSearchSubSections.DATE_RANGE]: DateRanges.THIS_YEAR,
}

export const GlobalSearchFilter = () => {
    const { t } = useTranslation()
    const [uriParams, setUriParams] = useSearchParams()
    const { register, handleSubmit, setValue, control, watch } = useForm<IGlobalSearchForm>({
        defaultValues: uriParams.get('filter') ? JSON.parse(uriParams.get('filter') ?? '') : defaultFormValue,
    })
    const owner = uriParams.get('filter') ? JSON.parse(uriParams.get('filter') ?? '')?.owner : undefined

    const onSubmit = (formData: FieldValues) => {
        setUriParams((prevSearchParams) => {
            return {
                ...deserializeParams(prevSearchParams),
                filter: JSON.stringify(formData),
                page: BASE_PAGE_NUMBER.toString(),
                pageSize: BASE_PAGE_SIZE.toString(),
            }
        })
    }

    const numberOfSelectedItems = (section: GlobalSearchSubSections): number => {
        const sec: { [key: string]: string } = watch(`${section}`)
        return Object.values(sec ?? []).filter((value) => value).length
    }

    const sections: IAccordionSection[] = [
        {
            title: t('globalSearch.filter.updateDate'),
            content: (
                <>
                    <RadioGroup className="govuk-radios--small">
                        <RadioButton
                            label={t('globalSearch.filter.today')}
                            id={DateRanges.TODAY}
                            value={DateRanges.TODAY}
                            {...register(GlobalSearchSubSections.DATE_RANGE)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.thisWeek')}
                            id={DateRanges.THIS_WEEK}
                            value={DateRanges.THIS_WEEK}
                            {...register(GlobalSearchSubSections.DATE_RANGE)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.thisMonth')}
                            id={DateRanges.THIS_MONTH}
                            value={DateRanges.THIS_MONTH}
                            {...register(GlobalSearchSubSections.DATE_RANGE)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.thisYear')}
                            id={DateRanges.THIS_YEAR}
                            value={DateRanges.THIS_YEAR}
                            {...register(GlobalSearchSubSections.DATE_RANGE)}
                        />
                        <RadioButton
                            label={t('globalSearch.filter.customRange')}
                            id={DateRanges.CUSTOM_RANGE}
                            value={DateRanges.CUSTOM_RANGE}
                            className={styles.floatInitial}
                            {...register(GlobalSearchSubSections.DATE_RANGE)}
                        />
                    </RadioGroup>
                    <DateInput
                        disabled={watch(GlobalSearchSubSections.DATE_RANGE) !== DateRanges.CUSTOM_RANGE}
                        label={t('globalSearch.filter.fromUpdate')}
                        {...register(CustomDateRange.FROM_UPDATE)}
                        control={control}
                        setValue={setValue}
                    />
                    <DateInput
                        disabled={watch(GlobalSearchSubSections.DATE_RANGE) !== DateRanges.CUSTOM_RANGE}
                        label={t('globalSearch.filter.toUpdate')}
                        {...register(CustomDateRange.TO_UPDATE)}
                        control={control}
                        setValue={setValue}
                    />
                </>
            ),
        },
        {
            title: t('globalSearch.filter.resultType'),
            content: (
                <fieldset className={classNames('govuk-checkboxes', 'govuk-checkboxes--small', styles.fieldset)}>
                    <CheckBox
                        label={t('globalSearch.filter.attribute')}
                        id={PortalSearchResultTypesItem.ATTRIBUTE}
                        {...register(`${GlobalSearchSubSections.RESULT_TYPES}.${PortalSearchResultTypesItem.ATTRIBUTE}`)}
                        title={t('globalSearch.filter.attribute')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.document')}
                        id={PortalSearchResultTypesItem.DOCUMENT}
                        {...register(`${GlobalSearchSubSections.RESULT_TYPES}.${PortalSearchResultTypesItem.DOCUMENT}`)}
                        title={t('globalSearch.filter.document')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.relation')}
                        id={PortalSearchResultTypesItem.RELATIONSHIP}
                        {...register(`${GlobalSearchSubSections.RESULT_TYPES}.${PortalSearchResultTypesItem.RELATIONSHIP}`)}
                        containerClassName={styles.floatInitial}
                        title={t('globalSearch.filter.relation')}
                    />
                </fieldset>
            ),
            summary: t('globalSearch.filter.selected', { count: numberOfSelectedItems(GlobalSearchSubSections.RESULT_TYPES) }),
        },
        {
            title: t('globalSearch.filter.section'),
            content: (
                <fieldset className={classNames('govuk-checkboxes', 'govuk-checkboxes--small', styles.fieldset)}>
                    <CheckBox
                        label={t('globalSearch.filter.eGov')}
                        id={PortalSearchSectionsItem.EGOV_COMPONENT}
                        {...register(`${GlobalSearchSubSections.SECTIONS}.${PortalSearchSectionsItem.EGOV_COMPONENT}`)}
                        title={t('globalSearch.filter.eGov')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.standardization')}
                        id={PortalSearchSectionsItem.STANDARDIZATION}
                        {...register(`${GlobalSearchSubSections.SECTIONS}.${PortalSearchSectionsItem.STANDARDIZATION}`)}
                        title={t('globalSearch.filter.standardization')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.dataObjects')}
                        id={PortalSearchSectionsItem.DATA_OBJECTS}
                        {...register(`${GlobalSearchSubSections.SECTIONS}.${PortalSearchSectionsItem.DATA_OBJECTS}`)}
                        title={t('globalSearch.filter.dataObjects')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.slaTcoEko')}
                        id={PortalSearchSectionsItem.SLA_TCO_EKO}
                        {...register(`${GlobalSearchSubSections.SECTIONS}.${PortalSearchSectionsItem.SLA_TCO_EKO}`)}
                        containerClassName={styles.floatInitial}
                        title={t('globalSearch.filter.slaTcoEko')}
                    />
                </fieldset>
            ),
            summary: t('globalSearch.filter.selected', { count: numberOfSelectedItems(GlobalSearchSubSections.SECTIONS) }),
        },
        {
            title: t('globalSearch.filter.owner'),
            content: (
                <SelectPOForFilter
                    isMulti={false}
                    ciType={PO}
                    label={t('KRIS.responsibleAuthority')}
                    name={GlobalSearchSubSections.OWNER}
                    valuesAsUuids={owner ? [owner] : []}
                    onChange={(val) => setValue(GlobalSearchSubSections.OWNER, val?.map((v) => v?.uuid ?? null)[0])}
                />
            ),
            summary: t('globalSearch.filter.selected', { count: watch(GlobalSearchSubSections.OWNER)?.[0] ? 1 : 0 }),
        },
        {
            title: t('globalSearch.filter.documentType'),
            content: (
                <fieldset className={classNames('govuk-checkboxes', 'govuk-checkboxes--small', styles.fieldset)}>
                    <CheckBox
                        label={t('globalSearch.filter.pdf')}
                        id={PortalSearchDmsDocumentExtensionsItem.PDF}
                        {...register(`${GlobalSearchSubSections.DOC_TYPES}.${PortalSearchDmsDocumentExtensionsItem.PDF}`)}
                        title={t('globalSearch.filter.pdf')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.docx')}
                        id={PortalSearchDmsDocumentExtensionsItem.DOCX}
                        {...register(`${GlobalSearchSubSections.DOC_TYPES}.${PortalSearchDmsDocumentExtensionsItem.DOCX}`)}
                        title={t('globalSearch.filter.docx')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.rtf')}
                        id={PortalSearchDmsDocumentExtensionsItem.RTF}
                        {...register(`${GlobalSearchSubSections.DOC_TYPES}.${PortalSearchDmsDocumentExtensionsItem.RTF}`)}
                        title={t('globalSearch.filter.rtf')}
                    />
                    <CheckBox
                        label={t('globalSearch.filter.otd')}
                        id={PortalSearchDmsDocumentExtensionsItem.ODT}
                        {...register(`${GlobalSearchSubSections.DOC_TYPES}.${PortalSearchDmsDocumentExtensionsItem.ODT}`)}
                        containerClassName={styles.floatInitial}
                        title={t('globalSearch.filter.otd')}
                    />
                </fieldset>
            ),
            summary: t('globalSearch.filter.selected', { count: numberOfSelectedItems(GlobalSearchSubSections.DOC_TYPES) }),
        },
    ]

    return (
        <StickyBox className={classNames(globalStyles.sidebarContainer, styles.marginLeft, globalStyles.globalSearchFilter)}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={classNames('govuk-!-font-size-19', globalStyles.sectionsContainer, styles.noPaddingTop)}
                noValidate
                title={t('globalSearch.filter.title')}
            >
                <AccordionContainer isSmall shouldNotUnMountContent sections={sections} />
                <Button type="submit" className={styles.button} variant="secondary" label={t('globalSearch.filter.submitButton')} />
            </form>
        </StickyBox>
    )
}
