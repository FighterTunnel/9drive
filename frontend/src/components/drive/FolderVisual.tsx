import { Folder } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FolderItem } from '@/data/drive-data'

const legacyColorMap: Record<string, string> = {
  'text-blue-500': '#3b82f6',
  'text-lime-500': '#84cc16',
  'text-cyan-400': '#22d3ee',
  'text-yellow-400': '#facc15',
  'text-orange-500': '#f97316',
}

export const defaultFolderColor = '#3b82f6'
export const defaultFolderIconUrl = 'https://api.iconify.design/lucide:folder.svg'

export const folderIconOptions = [
  { label: 'Folder', url: defaultFolderIconUrl },
  { label: 'Briefcase', url: 'https://api.iconify.design/lucide:briefcase.svg' },
  { label: 'Archive', url: 'https://api.iconify.design/lucide:archive.svg' },
  { label: 'Cloud', url: 'https://api.iconify.design/lucide:cloud.svg' },
  { label: 'Image', url: 'https://api.iconify.design/lucide:image.svg' },
  { label: 'Video', url: 'https://api.iconify.design/lucide:video.svg' },
  { label: 'Music', url: 'https://api.iconify.design/lucide:music.svg' },
  { label: 'Code', url: 'https://api.iconify.design/lucide:code.svg' },
]

export const folderColorOptions = ['#3b82f6', '#84cc16', '#22d3ee', '#facc15', '#f97316', '#ef4444', '#a855f7', '#14b8a6']

export function normalizeFolderColor(color?: string | null) {
  if (color?.startsWith('#')) return color
  return legacyColorMap[color ?? ''] ?? defaultFolderColor
}

export function iconUrlWithColor(iconUrl: string, color: string) {
  const separator = iconUrl.includes('?') ? '&' : '?'
  return `${iconUrl}${separator}color=${encodeURIComponent(color)}`
}

export function FolderVisual({ folder, className, iconClassName }: { folder: Pick<FolderItem, 'color' | 'iconUrl'>; className?: string; iconClassName?: string }) {
  const color = normalizeFolderColor(folder.color)
  const iconUrl = folder.iconUrl || defaultFolderIconUrl
  return (
    <span className={cn('inline-flex items-center justify-center', className)}>
      {iconUrl ? <img src={iconUrlWithColor(iconUrl, color)} alt="" className={cn('h-full w-full object-contain', iconClassName)} /> : <Folder className={cn('h-full w-full fill-current stroke-current', iconClassName)} style={{ color }} />}
    </span>
  )
}
