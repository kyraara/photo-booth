import { useEffect, useRef, useState } from 'react';

const StripPreview = ({ photos, selectedFrame, selectedFilter, onClose, onRetake }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        if (!photos || photos.length === 0) return;

        const processStrip = async () => {
            setIsProcessing(true);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            const photoWidth = photos[0].width;
            const photoHeight = photos[0].height;
            const gap = 12;
            const padding = 24;

            canvas.width = photoWidth + (padding * 2);
            canvas.height = (photoHeight * photos.length) + (gap * (photos.length - 1)) + (padding * 2) + 40;

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw photos
            for (let i = 0; i < photos.length; i++) {
                const y = padding + (i * (photoHeight + gap));

                if (selectedFilter) {
                    ctx.filter = selectedFilter;
                }

                ctx.drawImage(photos[i], padding, y, photoWidth, photoHeight);
                ctx.filter = 'none';

                if (selectedFrame) {
                    try {
                        const frameImg = new Image();
                        frameImg.crossOrigin = 'anonymous';
                        await new Promise((resolve, reject) => {
                            frameImg.onload = resolve;
                            frameImg.onerror = reject;
                            frameImg.src = selectedFrame;
                        });
                        ctx.drawImage(frameImg, padding, y, photoWidth, photoHeight);
                    } catch (err) {
                        console.error('Frame error:', err);
                    }
                }
            }

            // Branding
            ctx.fillStyle = '#666';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            const date = new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            ctx.fillText(`📸 Photo Booth • ${date}`, canvas.width / 2, canvas.height - 16);

            setFinalImage(canvas.toDataURL('image/png'));
            setIsProcessing(false);
        };

        processStrip();
    }, [photos, selectedFrame, selectedFilter]);

    const handleDownload = () => {
        if (!finalImage) return;

        const link = document.createElement('a');
        link.download = `photo-strip-${Date.now()}.png`;
        link.href = finalImage;
        link.click();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="modal-title">
                        <span>🎞️</span> Photo Strip
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-white mb-4 max-h-[50vh] overflow-y-auto">
                    <canvas ref={canvasRef} className="w-full h-auto" />

                    {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-white/20 border-t-violet-400 rounded-full spinner" />
                                <span className="text-white text-sm">Processing...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button onClick={onRetake} className="btn btn-secondary flex-1">
                        <span>↺</span> Retake
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="btn btn-primary flex-1"
                    >
                        <span>↓</span> Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StripPreview;
