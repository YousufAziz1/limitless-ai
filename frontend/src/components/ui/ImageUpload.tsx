import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, X, Camera, Sparkles } from 'lucide-react'

// ══════════════════════════════════════════
// ImageUpload — Drag-drop with camera capture
// ══════════════════════════════════════════

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  onClear: () => void
  selectedImage?: string | null
  disabled?: boolean
  isStreaming?: boolean
}

export function ImageUpload({ onImageSelect, onClear, selectedImage, disabled, isStreaming }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => {
        const preview = e.target?.result as string
        onImageSelect(file, preview)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  if (selectedImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-xl overflow-hidden"
        style={{ border: isStreaming ? '2px solid var(--saffron)' : '1px solid rgba(255,107,26,0.3)', boxShadow: isStreaming ? '0 0 20px rgba(255,107,26,0.3)' : 'none' }}
      >
        <img
          src={selectedImage}
          alt="Selected homework"
          className={`w-full max-h-48 object-cover transition-all duration-300 ${isStreaming ? 'brightness-75 contrast-125 grayscale-[20%]' : ''}`}
        />
        
        {/* Fake Live Scan Animation overlay */}
        {isStreaming && (
          <>
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-[#FF6B1A] shadow-[0_0_20px_#FF6B1A]"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,26,0.1)_1px,transparent_1px)] [background-size:100%_4px] opacity-30 pointer-events-none" />
            
            {/* Fake OCR Detection Boxes */}
            <motion.div 
              className="absolute top-[20%] left-[10%] w-[40%] h-[15%] border border-[#22C55E] bg-[#22C55E]/10 flex items-start justify-end p-1"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }} transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="text-[8px] bg-[#22C55E] text-black px-1 font-mono">Equation Detected</span>
            </motion.div>
            
            <motion.div 
              className="absolute top-[45%] left-[15%] w-[60%] h-[20%] border border-[#FF6B1A] bg-[#FF6B1A]/10 flex items-start justify-end p-1"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }} transition={{ duration: 1, delay: 1.2 }}
            >
              <span className="text-[8px] bg-[#FF6B1A] text-white px-1 font-mono">Formula Parsing...</span>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-[20%] right-[10%] w-[30%] h-[10%] border border-[#3b82f6] bg-[#3b82f6]/10 flex items-start justify-end p-1"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }} transition={{ duration: 1, delay: 1.8 }}
            >
              <span className="text-[8px] bg-[#3b82f6] text-white px-1 font-mono">Diagram Context</span>
            </motion.div>

            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded bg-[#0C0C10]/80 border border-[#FF6B1A]/50 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[#FF6B1A] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-[#FF6B1A] uppercase tracking-widest">Vision Model Active</span>
            </div>
          </>
        )}

        {!isStreaming && (
          <div
            className="absolute inset-0 flex items-end justify-between p-2"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--saffron)' }} />
              <span className="text-xs font-medium text-white">Image ready for analysis</span>
            </div>
            <button
              onClick={onClear}
              id="image-clear-btn"
              className="p-1 rounded-lg transition-colors hover:bg-white/20"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${isDragging ? 'var(--saffron)' : 'var(--border-subtle)'}`,
          background: isDragging ? 'var(--saffron-faint)' : 'var(--bg-elevated)',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <motion.div
          animate={isDragging ? { y: -4 } : { y: 0 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,107,26,0.12)' }}
        >
          <Image className="w-5 h-5" style={{ color: 'var(--saffron)' }} />
        </motion.div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Drop your textbook or homework image
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          id="image-upload-btn"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          id="camera-capture-btn"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <Camera className="w-4 h-4" />
          Take Photo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={disabled}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={disabled}
      />
    </div>
  )
}
