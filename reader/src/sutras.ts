import type { Section } from './diamond_sutra'
import { sutra as diamondSutraZh } from './diamond_sutra'
import { sutra as medicineSutraZh } from './medicine_sutra'
import { sutra as guanyinSutraZh } from './guanyin_sutra'
import { sutra as parentsKindnessSutraZh } from './parents_kindness_sutra'
import { sutra as ksitigarbhaSutraPart1Zh } from './ksitigarbha_sutra_part_1'
import { sutra as ksitigarbhaSutraPart2Zh } from './ksitigarbha_sutra_part_2'
import { sutra as ksitigarbhaSutraPart3Zh } from './ksitigarbha_sutra_part_3'
import { sutra as platformSutraZh } from './platform_sutra'
import { sutra as lotusSutraZh } from './lotus_sutra'
import { sutra as perfectSutraZh } from './perfect_sutra'
import { sutra as avatamsakaSutraZh } from './avatamsaka_sutra'
import { sutra as impermanenceSutraZh } from './impermanence_sutra'
import { sutra as shurangamaSutraZh } from './shurangama_sutra'
import { sutra as shurangamaSutraVol1Zh } from './shurangama_sutra_vol_1'
import { sutra as shurangamaSutraVol2Zh } from './shurangama_sutra_vol_2'
import { sutra as shurangamaSutraVol3Zh } from './shurangama_sutra_vol_3'
import { sutra as shurangamaSutraVol4Zh } from './shurangama_sutra_vol_4'
import { sutra as shurangamaSutraVol5Zh } from './shurangama_sutra_vol_5'
import { sutra as shurangamaSutraVol6Zh } from './shurangama_sutra_vol_6'
import { sutra as shurangamaSutraVol7Zh } from './shurangama_sutra_vol_7'
import { sutra as shurangamaSutraVol8Zh } from './shurangama_sutra_vol_8'
import { sutra as shurangamaSutraVol9Zh } from './shurangama_sutra_vol_9'
import { sutra as shurangamaSutraVol10Zh } from './shurangama_sutra_vol_10'

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
  lotusSutraZh as Sutra,
  perfectSutraZh as Sutra,
  avatamsakaSutraZh as Sutra,
  impermanenceSutraZh as Sutra,
  shurangamaSutraZh as Sutra,
  shurangamaSutraVol1Zh as Sutra,
  shurangamaSutraVol2Zh as Sutra,
  shurangamaSutraVol3Zh as Sutra,
  shurangamaSutraVol4Zh as Sutra,
  shurangamaSutraVol5Zh as Sutra,
  shurangamaSutraVol6Zh as Sutra,
  shurangamaSutraVol7Zh as Sutra,
  shurangamaSutraVol8Zh as Sutra,
  shurangamaSutraVol9Zh as Sutra,
  shurangamaSutraVol10Zh as Sutra,
]

export function findSutra(id: string | null): Sutra | undefined {
  if (!id) return undefined
  return sutras.find((s) => s.id === id)
}
