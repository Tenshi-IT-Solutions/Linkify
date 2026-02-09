import { SpeechClient } from '@google-cloud/speech';
import path from 'path';

// Create a client
const getClient = () => {
    // Check if credentials path is provided in env
    const credentialsPath = process.env.GOOGLE_CLOUD_CREDENTIALS_PATH;
    if (credentialsPath) {
        // Resolve relative path from project root (where .env typically is) if needed
        // Assuming process.cwd() is backend root
        const absolutePath = path.resolve(process.cwd(), credentialsPath);
        return new SpeechClient({
            keyFilename: absolutePath
        });
    }
    // Fallback to default auth or env vars if path not set
    return new SpeechClient();
};

const client = getClient();

/**
 * Transcribes audio content to text.
 * @param {string} audioContentBase64 - Base64 encoded audio content.
 * @returns {Promise<string>} - The transcribed text.
 */
export const transcribeAudio = async (audioContentBase64) => {
    try {
        // The audio needs to be base64 encoded string, but without the data URI prefix if present
        // Matches input like data:audio/webm;codecs=opus;base64,...
        const audioBytes = audioContentBase64.replace(/^data:audio\/[^;]+(?:;[^;]+)*;base64,/, "");

        const audio = {
            content: audioBytes,
        };

        const config = {
            encoding: 'WEBM_OPUS',
            // sampleRateHertz: 48000, // Let Google detect from WebM header
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
        };

        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        return transcription;
    } catch (error) {
        console.error('ERROR during transcription:', error.message);
        return ""; // Return empty string on failure so message can still send
    }
};
