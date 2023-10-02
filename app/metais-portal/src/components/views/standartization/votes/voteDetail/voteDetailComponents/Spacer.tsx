import { PropsWithChildren } from 'react'

import styles from '@/components/views/standartization/votes/voteDetail/voteDetail.module.scss'
interface ISpacer extends PropsWithChildren {
    noSpace?: boolean
}
export const Spacer: React.FC<ISpacer> = ({ children, noSpace }) => {
    return <div className={noSpace ? '' : styles.spaceVertical}>{children}</div>
}
