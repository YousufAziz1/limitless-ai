import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ArrowRight, Flame, Clock, Sparkles } from 'lucide-react'

import { useAppStore } from '@/store/appStore'
import { FALLBACK_SUBJECTS } from '@/services/api'
import type { Subject } from '@/types'

export function SubjectsPage() {
  const { settings, subjectProgress } = useAppStore()
  const isHindi = settings.language === 'hi'
  const [subjects] = useState<Subject[]>(FALLBACK_SUBJECTS)

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── Full-width hero banner ── */}
      {subjects.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '420px' }}
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-[#080810]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-[#080810]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent z-10" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 50%, ${subjects[0]?.color ?? '#60A5FA'}40 0%, transparent 60%)`,
            }}
          />

          {/* Floating emoji art */}
          <motion.div
            className="absolute right-[8%] top-1/2 text-[220px] opacity-15 select-none pointer-events-none"
            style={{ translateY: '-50%' }}
            animate={{ y: ['-48%', '-52%', '-48%'], rotate: [0, 4, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            {subjects[0].emoji}
          </motion.div>

          {/* Hero content — properly padded */}
          <div
            className="relative z-20 h-full flex flex-col justify-end"
            style={{ padding: '0 80px 48px' }}
          >
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#60A5FA]/15 border border-[#60A5FA]/25 mb-4">
                <Sparkles className="w-3 h-3 text-[#60A5FA]" />
                <span className="text-[#60A5FA] text-[10px] font-bold tracking-[0.25em] uppercase">{isHindi ? 'विशेष कोर्स' : 'Featured Course'}</span>
              </div>
              <h1
                className="text-white font-black mb-3 leading-none"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 6vw, 80px)' }}
              >
                {isHindi ? subjects[0].nameHi : subjects[0].name}
              </h1>
              <p className="text-gray-400 text-[15px] mb-6 max-w-[480px] leading-relaxed">
                {isHindi ? subjects[0].descriptionHi : subjects[0].description}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to={`/chat?subject=${subjects[0].id}`}
                  className="btn btn-primary btn-lg flex items-center gap-2 shadow-[0_0_30px_rgba(255,107,26,0.3)]"
                >
                  <ArrowRight className="w-4 h-4" />
                  {isHindi ? 'अभी शुरू करें' : 'Start Learning'}
                </Link>
                {subjects[0].topics.slice(0, 2).map(t => (
                  <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[13px] text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 80px 80px' }}>

        {/* Continue Learning row */}
        {subjects.filter(s => subjectProgress.some(p => p.subjectId === s.id)).length > 0 && (
          <div className="mb-12">
            <h3
              className="text-xl font-bold mb-5 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              <Clock className="w-5 h-5 text-[#FF6B1A]" />
              {isHindi ? 'पढ़ाई जारी रखें' : 'Continue Learning'}
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {subjects
                .filter(s => subjectProgress.some(p => p.subjectId === s.id))
                .map((subject, i) => {
                  const progress = subjectProgress.find(p => p.subjectId === subject.id)
                  return (
                    <Link key={subject.id} to={`/chat?subject=${subject.id}`} className="shrink-0 w-[280px]">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative h-[160px] rounded-2xl overflow-hidden border border-white/5 bg-[#0E0E16] hover:border-white/15 transition-all duration-300 cursor-pointer group"
                      >
                        <div
                          className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                          style={{ background: `linear-gradient(135deg, ${subject.color}30, transparent)` }}
                        />
                        <div className="absolute -right-3 -bottom-3 text-7xl opacity-10 group-hover:scale-110 transition-transform duration-500 select-none">
                          {subject.emoji}
                        </div>
                        <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-black/40 border border-white/10">
                              {subject.emoji}
                            </div>
                            {progress && (
                              <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                                <Flame className="w-3 h-3" style={{ color: subject.color }} />
                                <span className="text-[11px] font-semibold text-white">{progress.streak}d</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-[15px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                              {isHindi ? subject.nameHi : subject.name}
                            </h4>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: '45%', backgroundColor: subject.color }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )
                })}
            </div>
          </div>
        )}

        {/* Explore All Subjects */}
        <div className="mb-8">
          <h3
            className="text-xl font-bold mb-5 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            <BookOpen className="w-5 h-5 text-[#22C55E]" />
            {isHindi ? 'सभी विषय खोजें' : 'Explore Subjects'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {subjects.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <Link to={`/chat?subject=${subject.id}`} className="block h-full">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-white/5 bg-[#0E0E16] hover:border-white/15 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent z-10" />
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl group-hover:scale-125 transition-transform duration-500 opacity-75 group-hover:opacity-100 z-0 select-none">
                      {subject.emoji}
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                      <h4 className="text-[15px] font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                        {isHindi ? subject.nameHi : subject.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        {subject.topics[0]} · {subject.topics[1]}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-2xl text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            💡 {isHindi
              ? 'Limitless AI सभी विषयों को हिंदी और अंग्रेजी दोनों में समझाता है — बिना इंटरनेट के।'
              : 'Limitless AI explains every subject in Hindi and English — completely offline.'}
          </p>
        </motion.div>

      </div>
    </div>
  )
}
