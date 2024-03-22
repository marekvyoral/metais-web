import { Button } from '@isdd/idsk-ui-kit'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import classNames from 'classnames'
import { DeltaStatic, Sources } from 'quill'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import styles from './styles.module.scss'

import { QuillBulletListIcon, QuillLinkIcon, QuillOrderedListIcon } from '@isdd/metais-common/assets/images'

export enum RichQuillButtons {
    HEADER_1 = 'HEADER_1',
    HEADER_2 = 'HEADER_2',
    HEADER_3 = 'HEADER_3',
    HEADER_4 = 'HEADER_4',
    HEADER_5 = 'HEADER_5',
    BOLD = 'BOLD',
    UNDERLINE = 'UNDERLINE',
    ITALIC = 'ITALIC',
    BULLET_LIST = 'BULLET_LIST',
    ORDERED_LIST = 'ORDERED_LIST',
    LINK = 'LINK',
}

const QUILL_CLASSNAME_PRESSED = 'ql-active'

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
    id: string
    info?: string
    isRequired?: boolean
    error?: string
    value?: string
    onChange?(value: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor): void
    readOnly?: boolean
}

export interface ICustomToolBarProps {
    excludeOptions?: RichQuillButtons[]
    id: string
}

// https://github.com/quilljs/quill/issues/1328
//regex to check if value contains only empty lines
const regex = /^(<p><br><\/p>)+$/

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link']

const useMutationObservable = ({ target, callback }: { target: Node | null; callback: MutationCallback }) => {
    const [observer, setObserver] = useState<MutationObserver | null>(null)

    useEffect(() => {
        setObserver(new MutationObserver(callback))
    }, [callback, setObserver])

    useEffect(() => {
        if (!target || !observer) return
        observer.observe(target, { attributes: true, childList: true, subtree: true })
        return () => observer?.disconnect()
    }, [observer, target])
}

const CustomToolbar: React.FC<ICustomToolBarProps> = ({ excludeOptions, id }) => {
    const { t } = useTranslation()
    const wrapperRef = useRef(null)

    const onMutation = useCallback((mutationList: MutationRecord[]) => {
        mutationList.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const button = mutation.target as HTMLButtonElement
                const hasPressedClassName = button.className.includes(QUILL_CLASSNAME_PRESSED)
                button.setAttribute('aria-pressed', String(hasPressedClassName))
            }
        })
    }, [])

    useMutationObservable({ target: wrapperRef.current, callback: onMutation })

    const icons = ReactQuill.Quill.import('ui/icons')
    icons['bold'] = '<strong>B</strong>'
    icons['underline'] = '<u>U</u>'
    icons['italic'] = '<i>I</i>'
    icons['header']['1'] = 'H1'
    icons['header']['2'] = 'H2'
    icons['link'] = '<img alt="" src=' + QuillLinkIcon + ' />'
    icons['list']['ordered'] = '<img alt="" src=' + QuillOrderedListIcon + ' />'
    icons['list']['bullet'] = '<img alt="" src=' + QuillBulletListIcon + ' />'

    return (
        <div id={id} className={styles.customToolbar} ref={wrapperRef} role="list">
            {RichTextButtons.filter((item) => !excludeOptions?.includes(item.key)).map((item) => (
                <span role="listitem" key={item.key}>
                    <Button
                        key={item.key}
                        label={item.label}
                        className={classNames('idsk-button', item.className)}
                        variant="secondary"
                        value={item.value}
                        aria-label={t(`quill.buttonLabels.${item.key}`)}
                    />
                </span>
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
    readOnly,
}) => {
    const { t } = useTranslation()
    const quillRef = useRef<ReactQuill | null>(null)
    const errorId = `${id}-error`

    const modules = useMemo(
        () => ({
            clipboard: { matchVisual: false },
            toolbar: {
                container: `#${id}`,
            },
        }),
        [id],
    )

    const handleContentChange = (newValue: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor) => {
        if (regex.test(newValue)) {
            newValue = ''
        }
        onChange && onChange(newValue, delta, source, editor)
        setValue && setValue(name, newValue)
    }

    const requiredText = ` (${t('createEntity.required')})`
    const requiredLabel = `${isRequired ? requiredText : ''}`

    useEffect(() => {
        if (setValue && value) {
            setValue(name, value)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className={classNames('govuk-form-group', styles.fieldset, { 'govuk-form-group--error': !!error })}
            aria-description={`${t('quill.description')} ${label}`}
        >
            <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                {error}
            </span>
            <div className={styles.header}>
                {label && <div className="govuk-label">{label + requiredLabel}</div>}
                <div className={styles.infoDiv}>{info && <Tooltip descriptionElement={info} />}</div>
            </div>
            <div className={classNames({ 'govuk-input--error': !!error })}>
                <CustomToolbar excludeOptions={excludeOptions} id={id} />
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
                    readOnly={readOnly}
                    aria-errormessage={errorId}
                    aria-invalid={!!errorId}
                    aria-describedby={errorId}
                />
            </div>
        </div>
    )
}
