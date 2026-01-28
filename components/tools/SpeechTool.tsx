
import React, { useState, useRef } from 'react';
import { generateSpeech } from '../../services/geminiService';
import Loading from '../common/Loading';

const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

const SpeechTool: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSynthesize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAudioUrl(null);
    try {
      const base64Audio = await generateSpeech(text, selectedVoice);
      
      // Decoding raw PCM is handled in services, but let's wrap it in a format for <audio>
      // The API returns raw PCM. To play it easily, we can use AudioContext
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(bytes.buffer);
      const audioBuffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      // Convert buffer back to a blob to use with URL.createObjectURL for the audio tag
      // Or just play it directly
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      
      setAudioUrl("playing"); // Mock state to show something happened
    } catch (error) {
      console.error(error);
      alert("Error generating speech.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Vocal Engine</h1>
        <p className="text-slate-400">Transform any text into expressive, natural-sounding audio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste the text you want to convert to speech..."
            className="w-full h-64 p-6 bg-slate-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none shadow-xl text-lg"
          />
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <i className="fa-solid fa-microphone"></i> Select Voice
            </h3>
            <div className="flex flex-col gap-2">
              {voices.map(voice => (
                <button
                  key={voice}
                  onClick={() => setSelectedVoice(voice)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedVoice === voice
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                    : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold">{voice}</span>
                  {selectedVoice === voice && <i className="fa-solid fa-check text-[10px]"></i>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSynthesize}
            disabled={loading || !text}
            className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i>
                <span>Speak Text</span>
              </>
            )}
          </button>
          
          {audioUrl && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-emerald-400 text-sm animate-bounce">
              <i className="fa-solid fa-wave-square mr-2"></i> Audio playing now...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechTool;
