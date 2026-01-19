import { useState, useRef, useEffect } from 'react';

const delays = [
    { value: 0, label: 'No Delay' },
    { value: 3, label: '3s Delay' },
    { value: 5, label: '5s Delay' },
    { value: 10, label: '10s Delay' },
];

const DelaySelector = ({ selectedDelay, onSelectDelay }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentDelay = delays.find(d => d.value === selectedDelay) || delays[1];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="delay-selector" ref={dropdownRef}>
            <button
                className="delay-dropdown-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="delay-icon">⏱️</span>
                <span className="delay-label">{currentDelay.label}</span>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="delay-dropdown">
                    {delays.map((delay) => (
                        <button
                            key={delay.value}
                            className={`delay-option ${selectedDelay === delay.value ? 'active' : ''}`}
                            onClick={() => {
                                onSelectDelay(delay.value);
                                setIsOpen(false);
                            }}
                        >
                            {delay.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export { delays };
export default DelaySelector;
