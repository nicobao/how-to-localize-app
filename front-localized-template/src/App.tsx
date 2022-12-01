import logo from './logo.svg'
import './App.css'
import LanguageSwitcher from './LanguageSwitcher'
import {useTranslation} from 'react-i18next'
import OtherComponent from './OtherComponent'

function App() {
    const {t} = useTranslation('App')
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    {t('instructions')}
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('learn')}
                </a>
                <LanguageSwitcher />
                <OtherComponent />
            </header>
        </div>
    )
}

export default App
