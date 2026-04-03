// src/types/modules.ts

export interface Module {
  id:          string
  name:        string
  description: string
  path:        string
  icon:        string
  image?:      string
  color:       string
  accentColor: string
  category:    'vigilancia' | 'mapas' | 'seguridad' | 'social' | 'analisis'
}
