import { useLanguageStore } from '../store/useLanguageStore';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
];

const LanguageSelector = () => {
    const { selected: selectedLanguage, setLanguage } = useLanguageStore();

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
                Translation:
            </span>
            <select
                id="language-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="select select-bordered select-sm w-full max-w-xs"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector; 