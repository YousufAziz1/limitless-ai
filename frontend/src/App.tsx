import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ height: 'calc(100vh - 88px)', overflow: 'hidden', marginTop: '88px' }}
              >
                <ChatPage />
              </motion.div>
            } />
            <Route path="/dream" element={
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: '88px' }}
              >
                <DreamBuilderPage />
              </motion.div>
            } />
            <Route path="/subjects" element={
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: '88px' }}
              >
                <SubjectsPage />
              </motion.div>
            } />
            <Route path="/scan" element={
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: '88px' }}
              >
                <HomeworkScannerPage />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

// ══════════════════════════════════════════
// App — Root with health checks
// ══════════════════════════════════════════

function AppContent() {
  const { showLoadingScreen, setShowLoadingScreen, updateModelStatus, setFirstVisit } = useAppStore()
  const [showSetup, setShowSetup] = useState(false)

  // Check backend health on mount
  useEffect(() => {
    const init = async () => {
      // Show loading screen for at least 2.5s
      await new Promise(resolve => setTimeout(resolve, 2500))
      setShowLoadingScreen(false)
      setFirstVisit(false)

      // Check if backend is available
      const status = await checkHealth()
      updateModelStatus(status)

      // If backend offline → show setup page
      if (!status.available) {
        setShowSetup(true)
      }
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

  // New user setup flow — backend not running
  if (showSetup) {
    return (
      <AnimatePresence>
        <motion.div
          key="setup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
        >
          <SetupPage
            onConnected={() => {
              setShowSetup(false)
            }}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default function App() {
  return <AppContent />
}
