import { useState } from 'react';

const CameraSettings = ({
    facingMode,
    onToggleFacingMode,
    isMirrored,
    onToggleMirror,
    countdownTime,
    onCountdownChange
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const timerOptions = [
        { value: 0, label: 'Off' },
        { value: 3, label: '3s' },
        { value: 5, label: '5s' },
        { value: 10, label: '10s' },
    ];

    return (
        <div className="glass-card p-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between"
            >
                <div className="section-title mb-0">
                    <span>⚙️</span> Settings
                </div>
                <span className={`text-white/40 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3">
                    {/* Camera Switch */}
                    <div className="settings-row">
                        <span className="settings-label">
                            <span>📷</span> Camera
                        </span>
                        <button onClick={onToggleFacingMode} className="settings-value">
                            {facingMode === 'user' ? 'Front' : 'Back'}
                        </button>
                    </div>

                    {/* Mirror */}
                    <div className="settings-row">
                        <span className="settings-label">
                            <span>🪞</span> Mirror
                        </span>
                        <button
                            onClick={onToggleMirror}
                            className={`settings-value ${isMirrored ? 'active' : ''}`}
                        >
                            {isMirrored ? 'On' : 'Off'}
                        </button>
                    </div>

                    {/* Timer */}
                    <div>
                        <div className="settings-label mb-2">
                            <span>⏱️</span> Timer
                        </div>
                        <div className="timer-grid">
                            {timerOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => onCountdownChange(opt.value)}
                                    className={`timer-option ${countdownTime === opt.value ? 'active' : ''}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CameraSettings;
