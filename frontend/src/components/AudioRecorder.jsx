import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Send, Play, Pause } from "lucide-react";
import toast from "react-hot-toast";

const AudioRecorder = ({ onSend, onCancel }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        startRecording();
        return () => {
            stopRecordingCleanup();
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.error("Microphone access denied");
            onCancel();
        }
    };

    const stopRecordingCleanup = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const stopRecording = () => {
        stopRecordingCleanup();
        setIsRecording(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSend = () => {
        if (!audioBlob) return;

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            const base64Audio = reader.result;
            onSend(base64Audio);
        };
    };

    return (
        <div className="flex items-center gap-3 w-full animate-fade-in p-2 bg-base-200 rounded-lg">
            <button
                onClick={onCancel}
                className="btn btn-circle btn-ghost btn-sm text-error"
            >
                <Trash2 size={20} />
            </button>

            {isRecording ? (
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
                    <span className="font-mono">{formatTime(recordingTime)}</span>
                    <div className="flex-1" />
                    <button
                        onClick={stopRecording}
                        className="btn btn-circle btn-error btn-sm"
                    >
                        <Square size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex items-center gap-3">
                    <button
                        onClick={handlePlayPause}
                        className="btn btn-circle btn-ghost btn-sm"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    {/* Hidden audio element for preview */}
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        onPause={() => setIsPlaying(false)}
                    />

                    <div className="flex-1 h-8 bg-base-300 rounded-full overflow-hidden flex items-center justify-center">
                        <span className="text-xs opacity-50">Voice Message Preview</span>
                    </div>

                    <button
                        onClick={handleSend}
                        className="btn btn-circle btn-primary btn-sm"
                    >
                        <Send size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
