import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Camera = forwardRef(({
    onStreamReady,
    selectedFrame,
    selectedFilter,
    facingMode = 'user',
    isMirrored = true
}, ref) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useImperativeHandle(ref, () => ({
        capturePhoto: () => {
            if (!videoRef.current) return null;

            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');

            if (isMirrored) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
                ctx.restore();
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            return canvas;
        }
    }));

    useEffect(() => {
        const startCamera = async () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            try {
                setIsLoading(true);
                setError(null);

                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: facingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 960 }
                    },
                    audio: false
                });

                setStream(mediaStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        setIsLoading(false);
                        if (onStreamReady) onStreamReady(true);
                    };
                }
            } catch (err) {
                console.error('Camera error:', err);
                setError(
                    err.name === 'NotAllowedError'
                        ? 'Izinkan akses kamera di browser'
                        : err.name === 'NotFoundError'
                            ? 'Kamera tidak ditemukan'
                            : 'Gagal mengakses kamera'
                );
                setIsLoading(false);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-violet-400 rounded-full spinner" />
                        <span className="text-white/50 text-xs">Loading...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10 p-4">
                    <div className="text-center">
                        <div className="text-4xl mb-3">📷</div>
                        <p className="text-white/60 text-sm mb-3">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-secondary text-xs"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-video ${isMirrored ? 'camera-mirror' : ''}`}
                style={{ filter: selectedFilter || 'none' }}
            />

            {selectedFrame && (
                <img
                    src={selectedFrame}
                    alt="Frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
            )}
        </>
    );
});

Camera.displayName = 'Camera';

export default Camera;
