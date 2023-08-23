import { Button } from '@isdd/idsk-ui-kit'
import { InfoInputIcon } from '@isdd/idsk-ui-kit/src/info-input-icon/InfoInputIcon'
import classNames from 'classnames'
import { DeltaStatic, Sources } from 'quill'
import React, { useMemo, useRef } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import styles from './styles.module.scss'

import { QuillBulletListIcon, QuillLinkIcon, QuillOrderedListIcon } from '@isdd/metais-common/assets/images'

export enum RichQuillButtons {
    HEADER_1,
    HEADER_2,
    HEADER_3,
    HEADER_4,
    HEADER_5,
    BOLD,
    UNDERLINE,
    ITALIC,
    BULLET_LIST,
    ORDERED_LIST,
    LINK,
}

type TextButtonsProps = {
    key: RichQuillButtons
    label: string
    className?: string
    value?: string
}

const RichTextButtons: TextButtonsProps[] = [
    { key: RichQuillButtons.HEADER_1, label: 'H1', className: 'ql-header', value: '1' },
    { key: RichQuillButtons.HEADER_2, label: 'H2', className: 'ql-header', value: '2' },
    { key: RichQuillButtons.HEADER_3, label: 'H3', className: 'ql-header', value: '3' },
    { key: RichQuillButtons.HEADER_4, label: 'H4', className: 'ql-header', value: '4' },
    { key: RichQuillButtons.HEADER_5, label: 'H5', className: 'ql-header', value: '5' },
    { key: RichQuillButtons.BOLD, label: 'B', className: 'ql-bold' },
    { key: RichQuillButtons.ITALIC, label: 'I', className: 'ql-italic' },
    { key: RichQuillButtons.UNDERLINE, label: 'U', className: 'ql-underline' },
    { key: RichQuillButtons.BULLET_LIST, label: 'bullet list', className: 'ql-list', value: 'bullet' },
    { key: RichQuillButtons.ORDERED_LIST, label: 'ordered list', className: 'ql-list', value: 'ordered' },
    { key: RichQuillButtons.LINK, label: 'link', className: 'ql-link' },
]

export interface ITextAreaQuillProps {
    excludeOptions?: RichQuillButtons[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    name: string
    label?: string
    defaultValue?: ReactQuill.Value
    id?: string
    info?: string
    isRequired?: boolean
    error?: string
    value?: string
    onChange?(value: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor): void
}

export interface ICustomToolBarProps {
    excludeOptions?: RichQuillButtons[]
}

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link']

const CustomToolbar: React.FC<ICustomToolBarProps> = ({ excludeOptions }) => {
    const icons = ReactQuill.Quill.import('ui/icons')
    icons['bold'] = '<strong>B</strong>'
    icons['underline'] = '<u>U</u>'
    icons['italic'] = '<i>I</i>'
    icons['header']['1'] = 'H1'
    icons['header']['2'] = 'H2'
    icons['link'] = '<img src=' + QuillLinkIcon + ' />'
    icons['list']['ordered'] = '<img src=' + QuillOrderedListIcon + ' />'
    icons['list']['bullet'] = '<img src=' + QuillBulletListIcon + ' />'

    return (
        <div id="toolbar" className={styles.customToolbar}>
            {RichTextButtons.filter((item) => !excludeOptions?.includes(item.key)).map((item) => (
                <Button
                    key={item.key}
                    label={item.label}
                    className={classNames('idsk-button', item.className)}
                    variant="secondary"
                    value={item.value}
                />
            ))}
        </div>
    )
}

export const RichTextQuill: React.FC<ITextAreaQuillProps> = ({
    id,
    setValue,
    name,
    defaultValue,
    info,
    isRequired,
    label,
    error,
    value,
    onChange,
    excludeOptions,
}) => {
    const { t } = useTranslation()
    const quillRef = useRef<ReactQuill | null>(null)

    const modules = useMemo(
        () => ({
            toolbar: {
                container: '#toolbar',
            },
        }),
        [],
    )

    const handleContentChange = (newValue: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor) => {
        if (onChange) {
            onChange(newValue, delta, source, editor)
        } else {
            if (setValue) {
                setValue(name, newValue)
            }
        }
    }

    const requiredText = ` (${t('createEntity.required')})`
    const requiredLabel = `${isRequired ? requiredText : ''}`

    return (
        <div className={classNames('govuk-form-group', styles.fieldset, { 'govuk-form-group--error': !!error })}>
            {error && <span className="govuk-error-message">{error}</span>}
            <div className={styles.header}>
                {label && <div className="govuk-label">{label + requiredLabel}</div>}
                <div className={styles.infoDiv}>{info && <InfoInputIcon description={info} id={id ?? ''} />}</div>
            </div>
            <div className={classNames({ 'govuk-input--error': !!error })}>
                <CustomToolbar excludeOptions={excludeOptions} />
                <ReactQuill
                    id={id}
                    value={value}
                    ref={quillRef}
                    className={classNames(styles.customEditor)}
                    formats={formats}
                    modules={modules}
                    onChange={(newValue, newDelta, source, editor) => {
                        handleContentChange(newValue, newDelta, source, editor)
                    }}
                    defaultValue={defaultValue}
                />
            </div>
        </div>
    )
}
