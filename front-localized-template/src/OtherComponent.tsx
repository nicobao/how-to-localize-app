import {useTranslation} from "react-i18next"

function OtherComponent() {
    const {t} = useTranslation('OtherComponent')
    return (
        <div>
            <br />
            <div>{t('comment')}</div>
        </div>
    )
}

export default OtherComponent
