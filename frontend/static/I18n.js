const translations = {
    en: {
        profile: '👤 Profile',
        logout: '↳ Log out',
        liveMap: 'Live Emergency Map',
        liveMapSub: 'Active emergency signals across Bulgaria',
        activeSignal: 'Active Signal',
        activeSignals: 'Active Signals',
        emergency: '⚠️ EMERGENCY ⚠️',
        resolveEmergency: '✅ RESOLVE EMERGENCY',
        registeredUsers: 'Registered Users',
        totalSignals: 'Total Signals',
        activeSignalsCard: 'Active Signals',
        resolved: 'Resolved',
        whatEmergency: 'What is the emergency?',
        selectType: 'Select the type(s) of emergency you are experiencing.',
        additionalDetails: 'Any additional details about the emergency...',
        sendSignal: 'Send Emergency Signal',
        locatingGps: 'Locating GPS...',
        healthEmergency: 'Health Emergency',
        wildfire: 'Wildfire',
        flood: 'Flood',
        carAccident: 'Car Accident',
        animalAttack: 'Animal Attack',
        earthquake: 'Earthquake',
        lostStranded: 'Lost / Stranded',
        severeInjury: 'Severe Injury',
        poisoning: 'Poisoning',
        drowning: 'Drowning',
        landslide: 'Landslide',
        powerOutage: 'Power Outage (Critical)',
        other: 'Other',
        resolveTitle: 'Resolve Emergency?',
        resolveText: 'Are you sure the situation is under control? This will remove your active signal.',
        cancel: 'Cancel',
        resolve: 'Resolve',
        locatingPosition: 'Locating your GPS position...',
        sendingSignal: 'Sending emergency signal...',
        welcomeBack: 'Welcome Back',
        loginSub: 'Log in to your Signaid dashboard',
        emailAddress: 'Email Address',
        password: 'Password',
        logIn: 'Log In',
        newToSignaid: 'New to Signaid?',
        signUpHere: 'Sign up here',
        joinSignaid: 'Join Signaid',
        registerSub: 'Create an account to access emergency services',
        fullName: 'Full Name',
        createAccount: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        logInHere: 'Log in here',
        backToMap: '← Back to map',
        phoneNumber: 'Phone Number',
        healthConditions: 'Health Conditions',
        healthConditionsSub: 'Select any conditions that apply — this helps responders.',
        additionalHealthNotes: 'Additional Health Notes',
        additionalHealthNotesSub: 'Any other health details responders should know...',
        saveChanges: 'Save Changes',
        footer: '© 2026 Signaid — Emergency aid for remote communities',
    },
    bg: {
        profile: '👤 Профил',
        logout: '↳ Изход',
        liveMap: 'Карта на спешни сигнали',
        liveMapSub: 'Активни сигнали из България',
        activeSignal: 'Активен сигнал',
        activeSignals: 'Активни сигнали',
        emergency: '⚠️ СПЕШЕН СИГНАЛ ⚠️',
        resolveEmergency: '✅ МАРКИРАЙ КАТО РЕШЕНО',
        registeredUsers: 'Регистрирани потребители',
        totalSignals: 'Общо сигнали',
        activeSignalsCard: 'Активни сигнали',
        resolved: 'Решени',
        whatEmergency: 'Какъв е проблемът?',
        selectType: 'Изберете вида на спешния случай.',
        additionalDetails: 'Допълнителни подробности...',
        sendSignal: 'Изпрати сигнал',
        locatingGps: 'Локализиране...',
        healthEmergency: 'Здравословен проблем',
        wildfire: 'Горски пожар',
        flood: 'Наводнение',
        carAccident: 'Катастрофа',
        animalAttack: 'Нападение от животно',
        earthquake: 'Земетресение',
        lostStranded: 'Изгубен / Блокиран',
        severeInjury: 'Тежка травма',
        poisoning: 'Отравяне',
        drowning: 'Удавяне',
        landslide: 'Свлачище',
        powerOutage: 'Спиране на тока (критично)',
        other: 'Друго',
        resolveTitle: 'Маркиране като решено?',
        resolveText: 'Сигурен ли си, че ситуацията е овладяна? Сигналът ти ще бъде премахнат.',
        cancel: 'Отказ',
        resolve: 'Потвърди',
        locatingPosition: 'Определяне на GPS позиция...',
        sendingSignal: 'Изпращане на сигнал...',
        welcomeBack: 'Добре дошъл',
        loginSub: 'Влез в твоя Signaid акаунт',
        emailAddress: 'Имейл адрес',
        password: 'Парола',
        logIn: 'Вход',
        newToSignaid: 'Нямаш акаунт?',
        signUpHere: 'Регистрирай се тук',
        joinSignaid: 'Регистрация в Signaid',
        registerSub: 'Създай акаунт за достъп до спешни услуги',
        fullName: 'Пълно име',
        createAccount: 'Създай акаунт',
        alreadyHaveAccount: 'Вече имаш акаунт?',
        logInHere: 'Влез тук',
        backToMap: '← Обратно към картата',
        phoneNumber: 'Телефонен номер',
        healthConditions: 'Здравословни състояния',
        healthConditionsSub: 'Изберете приложимите — помага на спасителите.',
        additionalHealthNotes: 'Допълнителни здравни бележки',
        additionalHealthNotesSub: 'Други здравни детайли за спасителите...',
        saveChanges: 'Запази промените',
        footer: '© 2026 Signaid — Спешна помощ за отдалечени общности',
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attr = el.getAttribute('data-i18n-attr');
        if (attr) {
            el.setAttribute(attr, t(key));
        } else {
            el.textContent = t(key);
        }
    });
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'bg' : 'en';
    localStorage.setItem('language', currentLang);
    const btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = currentLang === 'en' ? '🇧🇬 BG' : '🇬🇧 EN';
    applyTranslations();
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = currentLang === 'en' ? '🇧🇬 BG' : '🇬🇧 EN';
    applyTranslations();
});