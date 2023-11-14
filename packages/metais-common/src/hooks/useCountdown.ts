import { useEffect, useState } from 'react'

type Props = {
    shouldCount: boolean
    timeCountInSeconds: number
    onCountDownEnd: () => void
}

export const useCountdown = ({ shouldCount, timeCountInSeconds, onCountDownEnd }: Props) => {
    const [countDown, setCountDown] = useState(timeCountInSeconds)

    useEffect(() => {
        setCountDown(timeCountInSeconds)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldCount])

    useEffect(() => {
        let countdownInterval: ReturnType<typeof setInterval>

        if (shouldCount) {
            countdownInterval = setInterval(() => {
                setCountDown((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(countdownInterval)
                        onCountDownEnd()
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        }

        return () => {
            if (countdownInterval) clearInterval(countdownInterval)
        }
    }, [onCountDownEnd, shouldCount])

    return { countDown }
}
