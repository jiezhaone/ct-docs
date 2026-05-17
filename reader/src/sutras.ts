import type { Section } from './diamond_sutra'
import { sutra as diamondSutraZh } from './diamond_sutra'
import { sutra as medicineSutraZh } from './medicine_sutra'
import { sutra as guanyinSutraZh } from './guanyin_sutra'
import { sutra as parentsKindnessSutraZh } from './parents_kindness_sutra'
import { sutra as ksitigarbhaSutraPart1Zh } from './ksitigarbha_sutra_part_1'
import { sutra as ksitigarbhaSutraPart2Zh } from './ksitigarbha_sutra_part_2'
import { sutra as ksitigarbhaSutraPart3Zh } from './ksitigarbha_sutra_part_3'
import { sutra as platformSutraZh } from './platform_sutra'
import { sutra as shurangamaSutraVol1Zh } from './shurangama_sutra_vol_1'

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

export const sutras: Sutra[] = [
  diamondSutraZh as Sutra,
  medicineSutraZh as Sutra,
  guanyinSutraZh as Sutra,
  parentsKindnessSutraZh as Sutra,
  ksitigarbhaSutraPart1Zh as Sutra,
  ksitigarbhaSutraPart2Zh as Sutra,
  ksitigarbhaSutraPart3Zh as Sutra,
  platformSutraZh as Sutra,
  shurangamaSutraVol1Zh as Sutra,
]

export function findSutra(id: string | null): Sutra | undefined {
  if (!id) return undefined
  return sutras.find((s) => s.id === id)
}
