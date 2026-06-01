'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GiftAccount } from '@/types'

interface Props {
  giftAccounts: GiftAccount[]
}

export function GiftSection({ giftAccounts }: Props) {
  const [copied, setCopied] = useState('')

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  if (giftAccounts.length === 0) return null

  const banks = giftAccounts.filter(g => g.type === 'bank')
  const ewallets = giftAccounts.filter(g => g.type === 'ewallet')

  return (
    <section className="netflix-section">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl font-bold text-center mb-3"
      >
        Amplop Digital
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-netflix-light/40 text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed"
      >
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin
        memberikan tanda kasih, kami menyediakan amplop digital.
      </motion.p>

      <div className="max-w-lg mx-auto space-y-4">
        {/* Bank Accounts */}
        {banks.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {banks.map((account, i) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-netflix-dark rounded-xl p-5 border border-netflix-gray/20 hover:border-netflix-red/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <p className="text-netflix-red font-bold text-sm">{account.provider_name}</p>
                  </div>
                  <p className="text-lg font-mono font-bold mb-1">{account.account_number}</p>
                  <p className="text-netflix-light/40 text-xs mb-3">a.n. {account.account_holder}</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(account.account_number, account.id)}
                    className="text-xs text-netflix-red hover:underline font-medium"
                  >
                    {copied === account.id ? '✓ Tersalin!' : '📋 Salin Nomor Rekening'}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* E-Wallet Accounts */}
        {ewallets.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {ewallets.map((account, i) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (banks.length + i) * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-netflix-dark rounded-xl p-5 border border-netflix-gray/20 hover:border-netflix-red/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-netflix-red font-bold text-sm">{account.provider_name}</p>
                  </div>
                  <p className="text-lg font-mono font-bold mb-1">{account.account_number}</p>
                  <p className="text-netflix-light/40 text-xs mb-3">a.n. {account.account_holder}</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(account.account_number, account.id)}
                    className="text-xs text-netflix-red hover:underline font-medium"
                  >
                    {copied === account.id ? '✓ Tersalin!' : '📋 Salin Nomor'}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
