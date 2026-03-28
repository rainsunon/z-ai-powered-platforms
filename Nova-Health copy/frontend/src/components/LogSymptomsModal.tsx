import React, { useState } from 'react';

interface LogSymptomsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogSymptomsModal({ isOpen, onClose }: LogSymptomsModalProps) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [severity, setSeverity] = useState<number>(5);

  if (!isOpen) return null;

  const symptomsList = [
    'Headache', 'Fatigue', 'Nausea', 'Dizziness', 
    'Joint Pain', 'Muscle Ache', 'Fever', 'Cough'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Submit logic here
      setTimeout(() => {
        onClose();
        setStep(1);
        setSelectedSymptoms([]);
        setOtherSymptom('');
        setSeverity(5);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-[2rem] shadow-2xl border border-surface-variant/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-surface-variant/50 flex items-center justify-between bg-surface-container-low/50">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface">Log Symptoms</h2>
            <p className="font-body text-sm text-outline mt-1">Step {step} of 3</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-surface-container">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 hide-scrollbar">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-headline font-semibold text-lg text-on-surface">What are you experiencing today?</h3>
              <div className="flex flex-wrap gap-3">
                {symptomsList.map(symptom => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-4 py-2.5 rounded-xl font-body text-sm font-medium transition-all border ${
                        isSelected 
                          ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm' 
                          : 'bg-surface border-outline-variant/50 text-on-surface hover:border-primary/50'
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4">
                <label className="font-headline font-semibold text-sm text-on-surface-variant block mb-2">Other symptoms</label>
                <input 
                  type="text" 
                  value={otherSymptom}
                  onChange={(e) => setOtherSymptom(e.target.value)}
                  placeholder="Type to add..." 
                  className="w-full bg-surface border border-outline-variant/50 rounded-xl py-3 px-4 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-headline font-semibold text-lg text-on-surface">How severe are your symptoms?</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-headline font-bold text-4xl text-primary">{severity}</span>
                  <span className="font-body text-sm font-medium text-outline">
                    {severity < 4 ? 'Mild' : severity < 7 ? 'Moderate' : 'Severe'}
                  </span>
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="flex justify-between font-body text-xs text-outline font-medium">
                  <span>1 (Very Mild)</span>
                  <span>10 (Unbearable)</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-headline font-semibold text-lg text-on-surface">Any additional notes?</h3>
              <textarea 
                rows={4}
                placeholder="How did it start? What makes it better or worse?" 
                className="w-full bg-surface border border-outline-variant/50 rounded-2xl py-4 px-4 font-body text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              ></textarea>

              <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary-container flex gap-3">
                <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  This information will be shared with Dr. Aris before your consultation today.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-variant/50 bg-surface-container-lowest flex items-center justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2.5 rounded-xl text-on-surface-variant font-headline font-semibold hover:bg-surface-container transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={step === 1 && selectedSymptoms.length === 0 && otherSymptom.trim() === ''}
            className="px-8 py-2.5 rounded-xl primary-gradient text-on-primary font-headline font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center gap-2"
          >
            {step === 3 ? 'Save Log' : 'Continue'}
            {step < 3 && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </div>

      </div>
    </div>
  );
}
