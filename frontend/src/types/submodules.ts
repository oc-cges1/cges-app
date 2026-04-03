// src/types/submodules.ts

export interface SubModule {
  id:          string
  name:        string
  description: string
  path:        string
  icon:        string
  image?:      string
  accentColor: string
  color:       string
  status:      'active' | 'development' | 'soon'
  parentId:    string
}

export interface ModuleMeta {
  id:          string
  name:        string
  description: string
  icon:        string
  image?:      string
  accentColor: string
  parentPath:  string
  parentName:  string
}

export const STATUS_LABEL: Record<SubModule['status'], string> = {
  active:      'Activo',
  development: 'En desarrollo',
  soon:        'Próximamente',
}

export const STATUS_COLOR: Record<SubModule['status'], string> = {
  active:      '#14B45A',
  development: '#E68C14',
  soon:        '#4A6078',
}
