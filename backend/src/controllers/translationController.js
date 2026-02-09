import translationService from '../lib/translationService.js';

const translationController = {
    async translateMessage(req, res) {
        try {
            const { text, targetLanguage } = req.body;
            
            if (!text || !targetLanguage) {
                return res.status(400).json({ 
                    error: 'Text and target language are required',
                    details: { text: !!text, targetLanguage: !!targetLanguage }
                });
            }

            // Validate target language format
            if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(targetLanguage)) {
                return res.status(400).json({ 
                    error: 'Invalid target language format. Use ISO 639-1 code (e.g., "en", "es", "fr")'
                });
            }

            
            if (!translationService.isInitialized()) {
                console.error('Translation service not initialized when attempting to translate:', {
                    text: text.substring(0, 50),
                    targetLanguage
                });
                return res.status(503).json({
                    error: 'Translation service is not available',
                    details: 'The translation service failed to initialize. Please check server logs.'
                });
            }

            console.log('Attempting translation:', {
                textLength: text.length,
                targetLanguage,
                userId: req.user?._id
            });

            // Detect source language first
            const sourceLanguage = await translationService.detectLanguage(text);
            // Use detected language as source for translation
            const translation = await translationService.translateText(text, targetLanguage, sourceLanguage);

            console.log('Translation completed successfully:', {
                sourceLanguage,
                targetLanguage,
                originalLength: text.length,
                translatedLength: translation.length
            });

            res.json({
                originalText: text,
                translatedText: translation,
                sourceLanguage,
                targetLanguage
            });
        } catch (error) {
            console.error('Translation controller error:', error);
            
            // Handle specific error cases
            if (error.code === 403) {
                return res.status(503).json({ 
                    error: 'Translation service authentication failed',
                    details: 'Please check Google Cloud service account permissions'
                });
            }

            if (error.message.includes('not initialized')) {
                return res.status(503).json({ 
                    error: 'Translation service is currently unavailable',
                    details: 'The service is not properly initialized'
                });
            }

            if (error.message.includes('Invalid target language')) {
                return res.status(400).json({ 
                    error: 'Invalid target language',
                    details: error.message
                });
            }

            // Generic error response
            res.status(500).json({ 
                error: 'Translation failed',
                details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
            });
        }
    }
};

export default translationController; 