'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Settings, Event, LoveStory, GalleryImage, Wish, GiftAccount } from '@/types'

export function useWeddingData() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loveStories, setLoveStories] = useState<LoveStory[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [wishes, setWishes] = useState<Wish[]>([])
  const [giftAccounts, setGiftAccounts] = useState<GiftAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, eventsRes, storiesRes, galleryRes, wishesRes, giftRes] =
          await Promise.all([
            supabase.from('settings').select('*').single(),
            supabase.from('events').select('*').order('order_index'),
            supabase.from('love_stories').select('*').order('order_index'),
            supabase.from('gallery').select('*').order('order_index'),
            supabase.from('wishes').select('*').order('created_at', { ascending: false }),
            supabase.from('gift_accounts').select('*').order('order_index'),
          ])

        if (settingsRes.data) setSettings(settingsRes.data)
        if (eventsRes.data) setEvents(eventsRes.data)
        if (storiesRes.data) setLoveStories(storiesRes.data)
        if (galleryRes.data) setGallery(galleryRes.data)
        if (wishesRes.data) setWishes(wishesRes.data)
        if (giftRes.data) setGiftAccounts(giftRes.data)
      } catch (error) {
        console.error('Error fetching wedding data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { settings, events, loveStories, gallery, wishes, setWishes, giftAccounts, loading }
}
