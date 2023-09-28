import React, { useMemo } from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/index'

import styles from './voteDetail.module.scss'

export interface IDetailItemData {
    itemTitleContent: string
    itemValueContent: JSX.Element
    hidden: boolean
}
export interface IDetailItemsData {
    tableData: IDetailItemData[]
}

export const VoteDetailItems: React.FC<IDetailItemsData> = ({ tableData }) => {
    const tableDataToShow = useMemo(() => {
        return tableData.filter((data) => data.hidden === false)
    }, [tableData])
    return (
        <table className={styles.itemsTable}>
            {tableDataToShow.map((detailItemData, index) => {
                return (
                    <tr key={'itemData' + index} className={styles.itemsTableRow}>
                        <td>
                            <TextBody size="L" className={styles.itemTitle}>
                                {detailItemData.itemTitleContent}:
                            </TextBody>
                        </td>
                        <td>{detailItemData.itemValueContent}</td>
                    </tr>
                )
            })}
        </table>
    )
}
