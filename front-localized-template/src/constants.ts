// should be in conf file instead
// If there is only one locale in the array, the LanguageSwitcher will be hidden
// The order of the locales does not matter
// But each locale must respect the format { countryCode: 'dev', nativeName: 'dev' }
// WARNING : The first element will be set as the fallback language (must be en-US in production / staging !)
export const availableLanguages = [
    {countryCode: 'en-US', nativeName: 'English'},
    {countryCode: 'dev', nativeName: 'dev'},
    {countryCode: 'zh-Hans', nativeName: '简体中文'},
    {countryCode: 'zh-Hant', nativeName: '繁体中文'},
    {countryCode: 'fr', nativeName: 'Français'},
]
