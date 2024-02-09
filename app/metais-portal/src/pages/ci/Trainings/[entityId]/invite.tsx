import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { TrainingInviteContainer } from '@/components/containers/TrainingInviteContainer'

const TrainingInvitePage = () => {
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY
    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
            <TrainingInviteContainer />
        </GoogleReCaptchaProvider>
    )
}

export default TrainingInvitePage
