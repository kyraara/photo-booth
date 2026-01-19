import { useState, useEffect } from 'react';

const Countdown = ({ count, onComplete, isActive }) => {
    const [currentCount, setCurrentCount] = useState(count);

    useEffect(() => {
        if (!isActive) {
            setCurrentCount(count);
            return;
        }

        if (currentCount === 0) {
            onComplete();
            return;
        }

        const timer = setTimeout(() => {
            setCurrentCount(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [currentCount, isActive, count, onComplete]);

    if (!isActive) return null;

    return (
        <div className="countdown-overlay">
            <div className="countdown-number" key={currentCount}>
                {currentCount > 0 ? currentCount : '📸'}
            </div>
        </div>
    );
};

export default Countdown;
