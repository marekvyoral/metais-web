import React from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { InfoIconWithText } from '@isdd/idsk-ui-kit/typography/InfoIconWithText'
import classNames from 'classnames'
import { diff_match_patch } from 'diff-match-patch'
import sanitizeHtml from 'sanitize-html'
import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'

import styles from './historyCompare.module.scss'

interface IHistoryCompareItemViewProps {
    label: string
    tooltip: string
    valueFirst: string | Array<string>
    valueSec: string | Array<string>
    isSimple?: boolean
    withoutCompare?: boolean
    showOnlyChanges?: boolean
}

export const HistoryCompareItemView: React.FC<IHistoryCompareItemViewProps> = ({
    label,
    tooltip,
    valueFirst,
    valueSec,
    isSimple,
    withoutCompare,
    showOnlyChanges,
}) => {
    const getArrayValue = (value: string[]): string => {
        if (Array.isArray(value)) {
            return value.join('')
        }

        return value
    }

    const isDiff = (): boolean => {
        if (Array.isArray(valueFirst) && Array.isArray(valueSec)) {
            if (valueFirst.length !== valueSec.length) {
                return true
            }

            for (let i = 0; i < valueFirst.length; i++) {
                if (valueFirst[i] !== valueSec[i]) {
                    return true
                }
            }
        } else {
            if (valueFirst !== valueSec) {
                return true
            }
        }

        return false
    }

    const makeDiffHtml = (): string => {
        const dmp = new diff_match_patch()

        let resultFirst = valueFirst.toString()
        let resultSec = valueSec.toString()

        if (Array.isArray(valueFirst)) {
            resultFirst = getArrayValue(valueFirst)
        }

        if (Array.isArray(valueSec)) {
            resultSec = getArrayValue(valueSec)
        }

        const diff = dmp.diff_main(resultFirst, resultSec)
        dmp.diff_cleanupSemantic(diff)
        const html = dmp.diff_prettyHtml(diff)

        return sanitizeHtml(
            html
                .replaceAll('style="background:#e6ffe6;"', `class='${styles.diffIns}'`)
                .replaceAll('style="background:#ffe6e6;', `class='${styles.diffDel}'`),
            {
                allowedTags: ['ins', 'del'],
                allowedAttributes: {
                    ins: ['class'],
                    del: ['class'],
                },
            },
        )
    }

    return showOnlyChanges && !isDiff() ? (
        <></>
    ) : (
        <DefinitionListItem
            label={
                tooltip ? (
                    <InfoIconWithText tooltip={tooltip} hideIcon={!tooltip} label={label}>
                        {label}
                    </InfoIconWithText>
                ) : (
                    <TextBody size="S" className={styles.textRow}>
                        &nbsp;
                        {label}
                    </TextBody>
                )
            }
            value={<span className={classNames(styles.textRow, 'govuk-body-s')}>{valueFirst} &nbsp;</span>}
            secColValue={
                !isSimple && (
                    <span className={classNames(styles.textRow, 'govuk-body-s')}>
                        {withoutCompare ? valueSec : <span dangerouslySetInnerHTML={{ __html: makeDiffHtml() }} />}
                    </span>
                )
            }
        />
    )
}
