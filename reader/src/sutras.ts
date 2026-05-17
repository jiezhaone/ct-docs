import type { Section } from './jingang'
import { sutra as diamondSutraZh } from './jingang'

export type Lang = 'zh-Hant' | 'zh-Hans' | 'en'

export const LANG_LABEL: Record<Lang, string> = {
  'zh-Hant': '繁中',
  'zh-Hans': '简中',
  en: 'EN',
}

export interface Sutra {
  id: string
  title: string
  lang: Lang
  preface?: string
  sections: Section[]
}

export const sutras: Sutra[] = [diamondSutraZh as Sutra]

export function findSutra(id: string | null): Sutra | undefined {
  if (!id) return undefined
  return sutras.find((s) => s.id === id)
}
