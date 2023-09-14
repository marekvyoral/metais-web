import React, { PropsWithChildren } from 'react'

import commonStyles from '@isdd/metais-common/styles/common.module.scss'

export const FlexColumnReverseWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className={commonStyles.flexColumnReverse}>{children}</div>
}
