import { useState, useRef, useCallback } from 'react';
import Camera from './components/Camera';
import FrameSelector from './components/FrameSelector';
import FilterSelector from './components/FilterSelector';
import ModeSelector from './components/ModeSelector';
import CameraSettings from './components/CameraSettings';
import Countdown from './components/Countdown';
import PhotoPreview from './components/PhotoPreview';
import StripPreview from './components/StripPreview';

function App() {
  const cameraRef = useRef(null);

  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const [photoMode, setPhotoMode] = useState('single');
  const [facingMode, setFacingMode] = useState('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const [countdownTime, setCountdownTime] = useState(3);

  const [stripPhotos, setStripPhotos] = useState([]);
  const [stripCount, setStripCount] = useState(0);
  const [showStripPreview, setShowStripPreview] = useState(false);

  const handleCapture = useCallback(() => {
    if (!isCameraReady || isCountingDown) return;

    if (countdownTime === 0) {
      performCapture();
    } else {
      setIsCountingDown(true);
    }
  }, [isCameraReady, isCountingDown, countdownTime]);

  const performCapture = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    if (cameraRef.current) {
      const photo = cameraRef.current.capturePhoto();
      if (photo) {
        if (photoMode === 'strip') {
          const newPhotos = [...stripPhotos, photo];
          setStripPhotos(newPhotos);
          setStripCount(newPhotos.length);

          if (newPhotos.length >= 4) {
            setShowStripPreview(true);
          }
        } else {
          setCapturedPhoto(photo);
        }
      }
    }
  }, [photoMode, stripPhotos]);

  const handleCountdownComplete = useCallback(() => {
    performCapture();
    setIsCountingDown(false);

    if (photoMode === 'strip' && stripPhotos.length < 3) {
      setTimeout(() => {
        if (countdownTime > 0) {
          setIsCountingDown(true);
        } else {
          performCapture();
        }
      }, 1000);
    }
  }, [performCapture, photoMode, stripPhotos.length, countdownTime]);

  const handleRetake = useCallback(() => {
    setCapturedPhoto(null);
    setStripPhotos([]);
    setStripCount(0);
    setShowStripPreview(false);
  }, []);

  const handleClosePreview = useCallback(() => {
    setCapturedPhoto(null);
    setShowStripPreview(false);
  }, []);

  const handleModeChange = useCallback((mode) => {
    setPhotoMode(mode);
    setStripPhotos([]);
    setStripCount(0);
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Photo Booth</h1>
        <p className="app-subtitle">Capture your best moments ✨</p>
      </header>

      {/* Main Layout */}
      <main className="app-main">
        {/* Camera Section */}
        <section className="camera-section">
          <div className="camera-area">
            <Camera
              ref={cameraRef}
              selectedFrame={selectedFrame}
              selectedFilter={selectedFilter}
              facingMode={facingMode}
              isMirrored={isMirrored}
              onStreamReady={setIsCameraReady}
            />

            {/* Strip Counter */}
            {photoMode === 'strip' && stripCount > 0 && !showStripPreview && (
              <div className="strip-badge">📸 {stripCount}/4</div>
            )}

            <Countdown
              count={countdownTime}
              isActive={isCountingDown}
              onComplete={handleCountdownComplete}
            />

            {showFlash && <div className="flash-effect" />}
          </div>

          {/* Capture Controls */}
          <div className="capture-controls">
            {photoMode === 'strip' && stripCount > 0 && !showStripPreview && (
              <button onClick={handleRetake} className="reset-btn">↺</button>
            )}

            <button
              onClick={handleCapture}
              disabled={!isCameraReady || isCountingDown || (photoMode === 'strip' && stripCount >= 4)}
              className="capture-btn"
            >
              {photoMode === 'strip' ? '🎞️' : '📷'}
            </button>
          </div>
        </section>

        {/* Controls Panel */}
        <aside className="controls-panel">
          <ModeSelector mode={photoMode} onModeChange={handleModeChange} />
          <FrameSelector selectedFrame={selectedFrame} onSelectFrame={setSelectedFrame} />
          <FilterSelector selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
          <CameraSettings
            facingMode={facingMode}
            onToggleFacingMode={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}
            isMirrored={isMirrored}
            onToggleMirror={() => setIsMirrored(m => !m)}
            countdownTime={countdownTime}
            onCountdownChange={setCountdownTime}
          />
        </aside>
      </main>

      {/* Modals */}
      {capturedPhoto && (
        <PhotoPreview
          photoCanvas={capturedPhoto}
          selectedFrame={selectedFrame}
          selectedFilter={selectedFilter}
          onClose={handleClosePreview}
          onRetake={handleRetake}
        />
      )}

      {showStripPreview && (
        <StripPreview
          photos={stripPhotos}
          selectedFrame={selectedFrame}
          selectedFilter={selectedFilter}
          onClose={handleClosePreview}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}

export default App;
