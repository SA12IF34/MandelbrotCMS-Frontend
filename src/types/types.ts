// Authentication

export interface Account {
  id: number,
  username: string,
  email: string,
  picture: string | null,
  about: string | null,
  password?: string
}

// --------------------

// Settings

export interface Settings {
  id?: number,
  account?: number,
  redirect_home: boolean,
  intro_parts_nav: boolean,
  default_entertainment_type: string,
  open_sidenav: boolean
}
 
//----------------------

interface BaseObj {
  id: number,
  title: string,
  description: string,
  create_date: string,
  update_date: string,
  user: number,
  route?: string
}

// Missions

export interface Mission {
  id?: number,
  content: string,
  project?: number | Project | null ,
  course?: number | Course | null,
  status?: string,
  list?: number,
  related?: Project | Course | RelatedObj
}

export interface MissionsList {
  id: number,
  title: string,
  reward: number,
  date: string,
  done: boolean,
  goal: null | number,
  missions?: Mission[],
  style?: string | null // indicates the display style
}

export interface RelatedObj {
    id: number,
    title: string,
    description?: string,
    status?: string,
    route?: string,
    type?: 'project' | 'course'
}

// Sessions Manager

export interface Project extends BaseObj {
  start_date: string,
  finish_date: string,
  status: string,
  partitions?: Array<Partition>
}

export interface Partition extends BaseObj {
  done: boolean,
  project: number
}

// Learning Tracker

export interface Course extends BaseObj {
  source: string,
  link: string,
  status: 'current' | 'later' | 'done',
  image: string,
  list: boolean,
  progress: number,
  sections?: Section[]
}

export interface Section {
  id: number,
  title: string,
  done?: boolean,
  course?: number
}

// Entertainment

export interface Entertainment extends BaseObj {
    link: string,
    type: 'anime&manga' | 'game' | 'shows&movies' | 'other',
    subtype: 'anime' | 'manga' | 'movie' | 'show' | 'game' | null,
    mal_id: number,
    status: 'current' | 'done' | 'future',
    special: boolean,
    image: string,
    image_upload?: string,
    locked: boolean,
    lock_reason: number | null, // Goal Id
    relatives: Array<Entertainment> | Array<number>,
    rate: number | null,
    user_rate: number | null,
    genres: Array<string>,

}

// Goals

export interface Goal extends BaseObj {
  projects?: Array<number> | null,
  courses?: Array<number> | null,
  rewards?: Array<number>,
  finish_words: string | null,
  missions: Array<number> | Array<string> | null,
  goals?: Array<number> | null,
  done: boolean ,
  progress?: number
}
