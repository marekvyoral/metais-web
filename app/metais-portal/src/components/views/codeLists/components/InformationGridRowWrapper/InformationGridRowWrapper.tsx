import styles from './informationGridRowWrapper.module.scss'

export const InformationGridRowWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className={styles.attributeGridRowBox}>{children}</div>
}
