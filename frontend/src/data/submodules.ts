// src/data/submodules.ts

import { SubModule, ModuleMeta } from '@/types/submodules'

export const SUB_MODULES: SubModule[] = [

  // ── Observatorio ─────────────────────────────────────────
  {
    id:          'obs-boletines',
    name:        'Boletines',
    description: 'Publicaciones periódicas del observatorio',
    path:        '/observatorio/boletines',
    icon:        '📰',
    image:       '/icons/LOGO-GV-OBSERVATORIO.png',
    accentColor: '#3F5FCC',
    color:       '#07071a',
    status:      'development',
    parentId:    'observatorio',
  },
  {
    id:          'obs-informes',
    name:        'Informes',
    description: 'Informes técnicos y de gestión',
    path:        '/observatorio/informes',
    icon:        '📋',
    accentColor: '#3F5FCC',
    color:       '#07071a',
    status:      'development',
    parentId:    'observatorio',
  },
// src/data/submodules.ts — agregar en SUB_MODULES:

  // ── Cámaras de Videovigilancia ────────────────────────────
  {
    id:          'camaras-georeferenciacion',
    name:        'Mapa de Cámaras',
    description: 'Georreferenciación de cámaras en el Valle del Cauca',
    path:        '/camaras/mapa',
    icon:        '🗺️',
    image:       '/icons/ImgCamara.png',
    accentColor: '#1A7FBF',
    color:       '#071624',
    status:      'active',
    parentId:    'camaras',
  },
  {
    id:          'camaras-dashboard',
    name:        'Dashboard de Cámaras',
    description: 'Indicadores y estadísticas en Looker Studio',
    path:        '/camaras/dashboard',
    icon:        '📊',
    accentColor: '#1A7FBF',
    color:       '#071624',
    status:      'active',
    parentId:    'camaras',
  },

  // ── sistema departamental de seguridad ────────────────────────────
  {
    id:          'sds-documentos',
    name:        'Documentos',
    description: 'Gestión y visualización de documentos institucionales',
    path:        '/sistema-departamental-de-seguridad/documentos',
    icon:        '📁',
    accentColor: '#C4940A',
    color:       '#151207',
    status:      'active',
    parentId:    'sistema-departamental-de-seguridad',
  },

  // ── Agregar aquí submódulos de otros módulos ──────────────
  // {
  //   id:          'alertas-orden-publico',
  //   name:        'Orden Público',
  //   description: 'Alertas de orden público departamental',
  //   path:        '/alertas-tempranas/orden-publico',
  //   icon:        '🚨',
  //   accentColor: '#E05A0A',
  //   color:       '#1a0f07',
  //   status:      'soon',
  //   parentId:    'alertas-tempranas',
  // },

]

export const MODULE_META: Record<string, ModuleMeta> = {

  observatorio: {
    id:          'observatorio',
    name:        'Observatorio del Delito',
    description: 'Centro de análisis de datos e información de seguridad.',
    icon:        '🔭',
    image:       '/icons/LOGO-GV-OBSERVATORIO.png',
    accentColor: '#3F5FCC',
    parentPath:  '/sistema-departamental-de-seguridad',
    parentName:  'Sistema Departamental',
  },
// src/data/submodules.ts — agregar en MODULE_META:

  camaras: {
    id:          'camaras',
    name:        'Cámaras de Videovigilancia',
    description: 'Sistema de monitoreo de cámaras del departamento del Valle del Cauca.',
    icon:        '📹',
    image:       '/icons/ImgCamara.png',
    accentColor: '#1A7FBF',
    parentPath:  '/',
    parentName:  'Panel Principal',
  },
  
  'sistema-departamental-de-seguridad': {
    id:          'sistema-departamental-de-seguridad',
    name:        'Sistema Departamental de Seguridad',
    description: 'Plataforma central de gestión y coordinación de seguridad departamental.',
    icon:        '🛡️',
    image:       '/icons/Logo-SDS.png',
    accentColor: '#C4940A',
    parentPath:  '/',
    parentName:  'Panel Principal',
  },

  // 'alertas-tempranas': {
  //   id:          'alertas-tempranas',
  //   name:        'Alertas Tempranas',
  //   description: 'Sistema de alertas activo del departamento.',
  //   icon:        '🚨',
  //   accentColor: '#E05A0A',
  //   parentPath:  '/sistema-departamental-de-seguridad',
  //   parentName:  'Sistema Departamental',
  // },

}

export function getSubModules(parentId: string): SubModule[] {
  return SUB_MODULES.filter((m) => m.parentId === parentId)
}

export function getModuleMeta(moduleId: string): ModuleMeta | undefined {
  return MODULE_META[moduleId]
}

export function findSubModule(id: string): SubModule | undefined {
  return SUB_MODULES.find((m) => m.id === id)
}

export function hasSubModules(moduleId: string): boolean {
  return SUB_MODULES.some((m) => m.parentId === moduleId)
}
