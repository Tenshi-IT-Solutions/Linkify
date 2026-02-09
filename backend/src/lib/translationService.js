import axios from 'axios';

class TranslationService {
    constructor() {
        this.baseUrl = 'https://api.mymemory.translated.net/get';
        this.apiKey = process.env.MYMEMORY_API_KEY || '';
        this.initialize();
    }

    initialize() {
        try {
            // Test the connection
            this.testConnection();
            console.log('Translation service initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing translation service:', error.message);
            return false;
        }
    }

    async testConnection() {
        try {
            let url = `${this.baseUrl}?q=Hello&langpair=en|es`;
            if (this.apiKey) url += `&key=${this.apiKey}`;
            const response = await axios.get(url);
            console.log('Test translation successful:', response.data.responseData.translatedText);
        } catch (error) {
            console.error('Test connection failed:', error.message);
            throw error;
        }
    }

    isInitialized() {
        return true;
    }

    async translateText(text, targetLanguage, sourceLanguage = 'en') {
        try {
            if (!text || !targetLanguage) {
                throw new Error('Text and target language are required');
            }
            if (!sourceLanguage) sourceLanguage = 'en'; // fallback

            console.log(`Attempting to translate text to ${targetLanguage}:`, text.substring(0, 50) + '...');
            let url = `${this.baseUrl}?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`;
            if (this.apiKey) url += `&key=${this.apiKey}`;
            console.log('Using MyMemory API key:', this.apiKey ? this.apiKey.slice(0, 4) + '...' : 'none');
            console.log('Request URL:', url);
            const response = await axios.get(url);
            
            if (response.data.responseStatus === 200) {
                console.log('Translation successful:', response.data.responseData.translatedText.substring(0, 50) + '...');
                return response.data.responseData.translatedText;
            } else {
                throw new Error(`Translation failed: ${response.data.responseStatus}`);
            }
        } catch (error) {
            console.error('Translation error:', error.message);
            throw error;
        }
    }

    async detectLanguage(text) {
        try {
            if (!text) {
                throw new Error('Text is required for language detection');
            }
            // Use LibreTranslate for language detection
            const response = await axios.post('https://libretranslate.de/detect', {
                q: text
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data && response.data.length > 0) {
                const detectedLanguage = response.data[0].language;
                console.log('Language detection successful:', detectedLanguage);
                return detectedLanguage;
            } else {
                throw new Error('Language detection failed: No language detected');
            }
        } catch (error) {
            console.error('Language detection error:', error.message);
            throw error;
        }
    }
}

const translationService = new TranslationService();
export default translationService; 