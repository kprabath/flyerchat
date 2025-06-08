import { User } from './user'

export namespace MessageType {
  export interface Base {
    author: User
    createdAt: number
    id: string
    status?: 'sending' | 'sent' | 'seen'
    type: string
  }

  export interface Video extends Base {
    type: 'video'
    uri: string
    thumbnailUrl?: string
  }

  export interface DerivedVideo extends Video {
    offset: number
    showName: boolean
    showStatus: boolean
  }

  export type Any = Video
  export type DerivedAny = DerivedVideo
} 