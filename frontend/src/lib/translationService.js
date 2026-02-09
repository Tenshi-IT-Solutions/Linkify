import { axiosInstance } from './axios';

export const translateMessage = async (text, targetLanguage) => {
    try {
        if (!text || !targetLanguage) {
            throw new Error('Text and target language are required');
        }

        const response = await axiosInstance.post('/translation/translate', {
            text,
            targetLanguage
        });

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return {
            translatedText: response.data.translatedText,
            sourceLanguage: response.data.sourceLanguage || 'auto',
            originalText: text
        };
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error(error.response?.data?.message || error.message || 'Translation failed');
    }
}; 