import React, { useState, useEffect } from 'react';
import { Volume2, MessageSquare, Sparkles, RotateCcw, Bot, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { CharacterRecord } from '../types';
import { soundEffects } from '../services/soundEffects';

interface AwakenedDialogueModalProps {
  character: CharacterRecord;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const AwakenedDialogueModal: React.FC<AwakenedDialogueModalProps> = ({
  character,
  isOpen,
  onClose,
  onReset,
}) => {
  const [selectedExchange, setSelectedExchange] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const isRobot = character.chassisType === 'hk-cyborg' || character.chassisType === 'hk-droid' || !!character.isRobotVocoder;

  useEffect(() => {
    if (isOpen) {
      setSelectedExchange(null);
      setIsMinimized(false);
      if (isRobot) {
        soundEffects.playRobotServo();
      }
      soundEffects.speak(character.awakeningSpeech, character.voicePitch, character.voiceRate, isRobot);
      setIsSpeaking(true);
      const timer = setTimeout(() => setIsSpeaking(false), 5500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, character, isRobot]);

  if (!isOpen) return null;

  const playSpeech = (text: string) => {
    if (isRobot) {
      soundEffects.playRobotServo();
    }
    soundEffects.speak(text, character.voicePitch, character.voiceRate, isRobot);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 4500);
  };

  // Helper to format HK prefixes (Query:, Statement:, Exclamation:, etc.)
  const renderFormattedDialogue = (text: string) => {
    const parts = text.split(/(Query:|Statement:|Exclamation:|Observation:|Declaration:|Clarification:|Affirmation:|Sensory Analysis:|Delighted Exclamation:|Directive Acknowledged:|Curious Observation:)/g);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.endsWith(':')) {
            return (
              <span key={i} className="text-amber-400 font-mono font-bold mr-1">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 md:right-8 z-40 max-w-md w-full px-2 pointer-events-none transition-all duration-300">
      {isMinimized ? (
        /* Minimized state: 100% unobstructed view of the 3D bed */
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border border-amber-400/60 shadow-2xl backdrop-blur-md text-xs text-slate-100 transition-all cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">{character.name} Awakened</span>
            <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              Show Dialogue
            </span>
          </button>
        </div>
      ) : (
        /* Expanded state: Positioned neatly on the bottom-right corner */
        <div className="p-4 rounded-2xl bg-slate-950/92 border border-amber-400/50 shadow-2xl backdrop-blur-md pointer-events-auto space-y-3 text-slate-200">
          
          {/* Header banner */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                {isRobot && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-slate-950 flex items-center justify-center text-slate-950">
                    <Bot className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white font-display leading-tight">{character.name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                    isRobot
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {isRobot ? 'HK DROID' : 'AWAKENED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{character.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => playSpeech(character.awakeningSpeech)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
                title="Replay Voice Audio"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-amber-400' : ''}`} />
              </button>

              {/* Minimize Text Toggle */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                title="Minimize Text to view 3D bed without obstruction"
              >
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Clear View</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-[11px] text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Close dialogue"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Awakening Speech Dialogue Bubble */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
              {isRobot ? <Bot className="w-3.5 h-3.5" /> : <Sparkles className="w-3 h-3" />}
              <span>{isRobot ? 'HK Droid Vocoder Transmission:' : 'Subject Awakening Transmission:'}</span>
            </div>
            <div className="text-xs font-medium text-white italic leading-relaxed">
              &ldquo;{renderFormattedDialogue(character.awakeningSpeech)}&rdquo;
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              {character.awakeningSubtext}
            </div>
          </div>

          {/* Interactive Response Prompts */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span>Respond to {character.name}:</span>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
              {character.dialogueTree.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedExchange(index);
                    playSpeech(item.answer);
                  }}
                  className={`w-full p-2 rounded-lg text-left text-[11px] transition-all flex items-start gap-1.5 border cursor-pointer ${
                    selectedExchange === index
                      ? 'bg-amber-950/40 border-amber-400 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-amber-400 font-mono mt-0.5">▶</span>
                  <span className="flex-1">{item.question}</span>
                </button>
              ))}
            </div>

            {/* Subject Reply */}
            {selectedExchange !== null && (
              <div className="mt-1.5 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 text-[11px] space-y-0.5">
                <span className="font-semibold text-amber-300">{character.name}:</span>
                <div className="text-white italic">
                  &ldquo;{renderFormattedDialogue(character.dialogueTree[selectedExchange].answer)}&rdquo;
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Bed
            </button>

            <span className="text-slate-400 font-mono text-[10px]">
              {isRobot ? 'CZERKA PROTOCOL: HK-Z47' : 'VITALS: STABLE'}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
