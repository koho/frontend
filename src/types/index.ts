export interface CloudreveFile {
  id: string,
  name: string,
  size: number,
  date: string,
  access: string,
  type: 'up' | 'file' | 'dir'
}

export type SortMethod = 'sizePos' | 'sizeRes' | 'namePos' | 'nameRev' | 'timePos' | 'timeRev'