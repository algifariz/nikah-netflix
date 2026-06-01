export interface Guest {
  id: string
  name: string
  phone?: string
  email?: string
  category: 'REGULAR' | 'VIP' | 'VVIP'
  invitation_code: string
  invitation_url?: string
  rsvp_status: 'pending' | 'attending' | 'not_attending'
  number_of_guests: number
  has_scanned: boolean
  scanned_at?: string
  wishes?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  date: string
  time_start: string
  time_end: string
  timezone?: string
  location: string
  address: string
  map_url?: string
  image_url?: string
  order_index: number
}

export interface LoveStory {
  id: string
  title: string
  date: string
  description: string
  image_url?: string
  order_index: number
}

export interface GalleryImage {
  id: string
  image_url: string
  caption?: string
  order_index: number
}

export interface Wish {
  id: string
  guest_name: string
  message: string
  created_at: string
}

export interface GiftAccount {
  id: string
  type: 'bank' | 'ewallet'
  provider_name: string
  account_number: string
  account_holder: string
  order_index: number
}

export interface Settings {
  id: string
  groom_name: string
  groom_full_name: string
  groom_father: string
  groom_mother: string
  groom_photo?: string
  bride_name: string
  bride_full_name: string
  bride_father: string
  bride_mother: string
  bride_photo?: string
  hero_image?: string
  opening_text: string
  hashtag: string
  wedding_date: string
  music_url?: string
}

export interface DashboardStats {
  totalGuests: number
  attending: number
  notAttending: number
  pending: number
  scanned: number
  totalWishes: number
  vvipCount: number
  vipCount: number
  regularCount: number
}
