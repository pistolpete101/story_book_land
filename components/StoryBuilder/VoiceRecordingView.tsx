'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';

interface VoiceRecordingViewProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onClose: () => void;
}

export default function VoiceRecordingView({ onRecordingComplete, onClose }: VoiceRecordingViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setHasRecording(true);
        onRecordingComplete(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Recording</h3>
          <p className="text-gray-600">
            Record your voice to narrate this part of the story
          </p>
        </div>

        {/* Recording Status */}
        <div className="text-center mb-6">
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mic className="w-10 h-10 text-red-600" />
            </motion.div>
          )}
          
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatTime(recordingTime)}
          </div>
          
          <div className="text-sm text-gray-500">
            {isRecording ? 'Recording...' : hasRecording ? 'Recording complete' : 'Ready to record'}
          </div>
        </div>

        {/* Audio Player */}
        {hasRecording && audioURL && (
          <div className="mb-6">
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={playRecording}
                className="p-3 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-6 h-6 text-primary-600" /> : <Play className="w-6 h-6 text-primary-600" />}
              </button>
              <div className="text-sm text-gray-600">
                {isPlaying ? 'Playing...' : 'Tap to play'}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          {!hasRecording ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Record</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Use Recording
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Volume2 className="w-4 h-4" />
              <span>Speak clearly into your microphone</span>
            </div>
            <div className="text-xs text-gray-400">
              Your recording will be saved and can be played back
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
