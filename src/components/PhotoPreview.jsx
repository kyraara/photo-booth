import { useEffect, useRef, useState } from 'react';

const PhotoPreview = ({ photoCanvas, selectedFrame, selectedFilter, onClose, onRetake }) => {
    const canvasRef = useRef(null);
    const [finalImage, setFinalImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        if (!photoCanvas) return;

        const processImage = async () => {
            setIsProcessing(true);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = photoCanvas.width;
            canvas.height = photoCanvas.height;

            if (selectedFilter) {
                ctx.filter = selectedFilter;
            }

            ctx.drawImage(photoCanvas, 0, 0);
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

                    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
                } catch (err) {
                    console.error('Error loading frame:', err);
                }
            }

            setFinalImage(canvas.toDataURL('image/png'));
            setIsProcessing(false);
        };

        processImage();
    }, [photoCanvas, selectedFrame, selectedFilter]);

    const handleDownload = () => {
        if (!finalImage) return;

        const link = document.createElement('a');
        link.download = `photo-booth-${Date.now()}.png`;
        link.href = finalImage;
        link.click();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="modal-title">
                        <span>📸</span> Your Photo
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black mb-4">
                    <canvas ref={canvasRef} className="w-full h-auto" />

                    {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-violet-400 rounded-full spinner" />
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

export default PhotoPreview;
