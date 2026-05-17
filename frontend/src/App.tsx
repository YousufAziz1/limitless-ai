import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { LandingPage } from '@/pages/LandingPage'
import { ChatPage } from '@/pages/ChatPage'
import { DreamBuilderPage } from '@/pages/DreamBuilderPage'
import { SubjectsPage } from '@/pages/SubjectsPage'
import { HomeworkScannerPage } from '@/pages/HomeworkScannerPage'
import { SetupPage } from '@/pages/SetupPage'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { useAppStore } from '@/store/appStore'
import { checkHealth } from '@/services/api'

// ══════════════════════════════════════════
// RequireBackend — Gates AI pages behind setup
// Landing page stays always accessible
// ══════════════════════════════════════════

function RequireBackend({ children }: { children: React.ReactNode }) {
  const { updateModelStatus } = useAppStore()
  const [checking, setChecking] = useState(true)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const check = async () => {
      const status = await checkHealth()
      updateModelStatus(status)
      setAvailable(status.available)
      setChecking(false)
    }
    check()
  }, [updateModelStatus])

  if (checking) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 88px)', marginTop: '88px' }}>
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ color: '#FF6B1A' }} />
      </div>
    )
  }

  if (!available) {
    return (
      <SetupPage
        onConnected={() => {
          setAvailable(true)
        }}
      />
    )
  }

  return <>{children}</>
}

// ══════════════════════════════════════════
// App Router — Animated page transitions
// ══════════════════════════════════════════

function AppRoutes() {
  const location = useLocation()

  return (
    <>
      {/* Global Floating Pill Navbar — shows on ALL pages */}
      <Navbar />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Landing page — ALWAYS accessible, no backend needed */}
            <Route path="/" element={<LandingPage />} />

            {/* AI features — require backend */}
            <Route path="/chat" element={
              <RequireBackend>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ height: 'calc(100vh - 88px)', overflow: 'hidden', marginTop: '88px' }}
                >
                  <ChatPage />
                </motion.div>
              </RequireBackend>
            } />
            <Route path="/dream" element={
              <RequireBackend>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: '88px' }}
                >
                  <DreamBuilderPage />
                </motion.div>
              </RequireBackend>
            } />
            <Route path="/subjects" element={
              <RequireBackend>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: '88px' }}
                >
                  <SubjectsPage />
                </motion.div>
              </RequireBackend>
            } />
            <Route path="/scan" element={
              <RequireBackend>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: '88px' }}
                >
                  <HomeworkScannerPage />
                </motion.div>
              </RequireBackend>
            } />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

// ══════════════════════════════════════════
// App — Root with loading screen
// ══════════════════════════════════════════

function AppContent() {
  const { showLoadingScreen, setShowLoadingScreen, updateModelStatus, setFirstVisit } = useAppStore()

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500))
      setShowLoadingScreen(false)
      setFirstVisit(false)

      // Non-blocking health check
      const status = await checkHealth()
      updateModelStatus(status)
    }
    init()
  }, [setShowLoadingScreen, setFirstVisit, updateModelStatus])

  // Periodic health checks every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await checkHealth()
      updateModelStatus(status)
    }, 30_000)
    return () => clearInterval(interval)
  }, [updateModelStatus])

  if (showLoadingScreen) {
    return (
      <AnimatePresence>
        <LoadingScreen key="loading" />
      </AnimatePresence>
    )
  }

  return (
    <HashRouter>
      <CursorGlow />
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
        }}
      />
    </HashRouter>
  )
}

export default function App() {
  return <AppContent />
}
