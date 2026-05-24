import type {
  User,
  UploadRecord,
  ValidationIssue,
  QualityPoint,
  ErrorDistribution,
  DatasetComparison,
  ReportRecord,
  ColumnMapping,
  StandardField,
  SourceColumn,
  NavItem,
} from '@/src/types'

export const currentUser: User = {
  id: 'usr_001',
  name: 'Gabriel Silva',
  email: 'gabriel@dataclean.io',
  role: 'admin',
  avatar: '',
}

export const recentUploads: UploadRecord[] = [
  { id: 'up_001', fileName: 'clientes_marzo_2026.csv', fileSize: '2.4 MB', records: 15234, status: 'completed', uploadedAt: '2026-03-15T10:30:00Z', userId: 'usr_001' },
  { id: 'up_002', fileName: 'exportacion_productos.xlsx', fileSize: '4.8 MB', records: 28451, status: 'completed', uploadedAt: '2026-03-14T14:20:00Z', userId: 'usr_001' },
  { id: 'up_003', fileName: 'transacciones_q1.csv', fileSize: '12.1 MB', records: 89203, status: 'processing', uploadedAt: '2026-03-13T09:15:00Z', userId: 'usr_001' },
  { id: 'up_004', fileName: 'inventario_productos.csv', fileSize: '1.2 MB', records: 5432, status: 'completed', uploadedAt: '2026-03-12T16:45:00Z', userId: 'usr_001' },
  { id: 'up_005', fileName: 'tickets_soporte.csv', fileSize: '3.6 MB', records: 18765, status: 'failed', uploadedAt: '2026-03-11T11:00:00Z', userId: 'usr_001' },
]

export const qualityTrends: QualityPoint[] = [
  { date: '2026-01-01', score: 92.4, records: 45000, errors: 3420 },
  { date: '2026-01-15', score: 91.8, records: 52000, errors: 4264 },
  { date: '2026-02-01', score: 93.2, records: 58000, errors: 3944 },
  { date: '2026-02-15', score: 94.1, records: 61000, errors: 3599 },
  { date: '2026-03-01', score: 93.5, records: 67000, errors: 4355 },
  { date: '2026-03-15', score: 95.2, records: 72000, errors: 3456 },
]

export const errorDistribution: ErrorDistribution[] = [
  { name: 'Campo faltante', value: 1240, color: '#EF4444' },
  { name: 'Email inválido', value: 890, color: '#F59E0B' },
  { name: 'Duplicado exacto', value: 654, color: '#22C55E' },
  { name: 'Teléfono inválido', value: 523, color: '#3B82F6' },
  { name: 'Duplicado difuso', value: 345, color: '#8B5CF6' },
  { name: 'Fecha inválida', value: 234, color: '#EC4899' },
  { name: 'Fuera de rango', value: 187, color: '#14B8A6' },
  { name: 'Contradicción negocio', value: 98, color: '#F97316' },
  { name: 'Inconsistencia referencial', value: 76, color: '#6366F1' },
]

export const errorCategories: ErrorDistribution[] = [
  { name: 'Duplicado exacto', value: 654, color: '#22C55E' },
  { name: 'Duplicado difuso', value: 345, color: '#8B5CF6' },
  { name: 'Campo faltante', value: 1240, color: '#EF4444' },
  { name: 'Email inválido', value: 890, color: '#F59E0B' },
  { name: 'Teléfono inválido', value: 523, color: '#3B82F6' },
  { name: 'Fecha inválida', value: 234, color: '#EC4899' },
  { name: 'Fuera de rango', value: 187, color: '#14B8A6' },
  { name: 'Inconsistencia referencial', value: 76, color: '#6366F1' },
  { name: 'Contradicción negocio', value: 98, color: '#F97316' },
]

export const validationIssues: ValidationIssue[] = [
  { id: 'vi_001', row: 1042, column: 'email', category: 'invalid_email', message: 'Formato de email inválido', value: 'john.doe@', severity: 'major', status: 'open' },
  { id: 'vi_002', row: 1043, column: 'email', category: 'invalid_email', message: 'Dominio faltante en el email', value: 'jane.smith@company', severity: 'major', status: 'open' },
  { id: 'vi_003', row: 1087, column: 'phone', category: 'invalid_phone', message: 'Número de teléfono muy corto', value: '+1 555 123', severity: 'major', status: 'open' },
  { id: 'vi_004', row: 1091, column: 'phone', category: 'invalid_phone', message: 'Código de país inválido', value: '+999 555 1234', severity: 'minor', status: 'open' },
  { id: 'vi_005', row: 1102, column: 'date', category: 'invalid_date', message: 'Formato de fecha inválido', value: '2026/13/01', severity: 'critical', status: 'open' },
  { id: 'vi_006', row: 1103, column: 'date', category: 'invalid_date', message: 'Fecha futura no permitida', value: '2027-01-01', severity: 'major', status: 'resolved' },
  { id: 'vi_007', row: 1123, column: 'full_name', category: 'missing_field', message: 'El nombre completo es requerido', value: '', severity: 'critical', status: 'open' },
  { id: 'vi_008', row: 1124, column: 'email', category: 'missing_field', message: 'El email es requerido', value: '', severity: 'critical', status: 'open' },
  { id: 'vi_009', row: 1145, column: 'address', category: 'missing_field', message: 'La dirección es requerida', value: '', severity: 'major', status: 'open' },
  { id: 'vi_010', row: 1167, column: 'id', category: 'exact_duplicate', message: 'Fila duplicada exacta encontrada', value: 'ID-45291', severity: 'major', status: 'open' },
  { id: 'vi_011', row: 1168, column: 'id', category: 'exact_duplicate', message: 'Fila duplicada exacta encontrada', value: 'ID-45291', severity: 'major', status: 'open' },
  { id: 'vi_012', row: 1190, column: 'full_name', category: 'fuzzy_duplicate', message: 'Nombre similar detectado', value: 'Jon Smith', severity: 'minor', status: 'open' },
  { id: 'vi_013', row: 1191, column: 'full_name', category: 'fuzzy_duplicate', message: 'Nombre similar detectado', value: 'John Smith', severity: 'minor', status: 'open' },
  { id: 'vi_014', row: 1210, column: 'age', category: 'out_of_range', message: 'Edad excede el máximo (120)', value: '245', severity: 'critical', status: 'open' },
  { id: 'vi_015', row: 1211, column: 'salary', category: 'out_of_range', message: 'Salario con valor negativo', value: '-5000', severity: 'critical', status: 'open' },
  { id: 'vi_016', row: 1234, column: 'country', category: 'referential_inconsistency', message: 'El código de país no coincide con la ciudad', value: 'USA / París', severity: 'major', status: 'open' },
  { id: 'vi_017', row: 1245, column: 'postal_code', category: 'referential_inconsistency', message: 'El código postal no coincide con la ciudad', value: '90210 / New York', severity: 'major', status: 'open' },
  { id: 'vi_018', row: 1267, column: 'age', category: 'business_contradiction', message: 'La edad y fecha de nacimiento se contradicen', value: 'Edad: 25, FDN: 1980', severity: 'critical', status: 'open' },
  { id: 'vi_019', row: 1268, column: 'employment', category: 'business_contradiction', message: 'El estado laboral y la edad se contradicen', value: 'Tiempo completo, Edad: 12', severity: 'major', status: 'open' },
  { id: 'vi_020', row: 1290, column: 'phone', category: 'invalid_phone', message: 'El teléfono contiene letras', value: '+1 555-ABC-1234', severity: 'major', status: 'open' },
]

export const datasetComparisons: DatasetComparison[] = [
  { id: 'ds_001', name: 'Clientes Q1 2026', records: 15234, errors: 892, qualityScore: 94.1, date: '2026-03-15' },
  { id: 'ds_002', name: 'Productos 2026', records: 28451, errors: 1423, qualityScore: 95.0, date: '2026-03-14' },
  { id: 'ds_003', name: 'Transacciones Q1', records: 89203, errors: 5346, qualityScore: 94.0, date: '2026-03-13' },
  { id: 'ds_004', name: 'Inventario Productos', records: 5432, errors: 187, qualityScore: 96.6, date: '2026-03-12' },
  { id: 'ds_005', name: 'Tickets Soporte', records: 18765, errors: 2104, qualityScore: 88.8, date: '2026-03-11' },
]

export const reports: ReportRecord[] = [
  { id: 'rpt_001', name: 'Resumen Ejecutivo - Q1 2026', type: 'executive', format: 'pdf', createdAt: '2026-03-15', status: 'completed', size: '2.4 MB' },
  { id: 'rpt_002', name: 'Informe de Calidad - Marzo 2026', type: 'detailed', format: 'pdf', createdAt: '2026-03-14', status: 'completed', size: '5.1 MB' },
  { id: 'rpt_003', name: 'Exportación Resultados', type: 'detailed', format: 'csv', createdAt: '2026-03-13', status: 'completed', size: '1.8 MB' },
  { id: 'rpt_004', name: 'Resumen Semanal Calidad', type: 'summary', format: 'xlsx', createdAt: '2026-03-12', status: 'generating', size: '--' },
  { id: 'rpt_005', name: 'Resumen Ejecutivo - Feb 2026', type: 'executive', format: 'pdf', createdAt: '2026-02-28', status: 'completed', size: '2.1 MB' },
  { id: 'rpt_006', name: 'Informe de Calidad - Feb 2026', type: 'detailed', format: 'pdf', createdAt: '2026-02-28', status: 'completed', size: '4.7 MB' },
  { id: 'rpt_007', name: 'Exportación Resultados Feb', type: 'detailed', format: 'csv', createdAt: '2026-02-27', status: 'failed', size: '--' },
  { id: 'rpt_008', name: 'Resumen Semanal S8', type: 'summary', format: 'xlsx', createdAt: '2026-02-24', status: 'completed', size: '0.9 MB' },
]

export const sourceColumns: SourceColumn[] = [
  { name: 'nombre', sample: 'Juan', detected: true },
  { name: 'apellido', sample: 'Pérez', detected: true },
  { name: 'correo_electronico', sample: 'juan@ejemplo.com', detected: true },
  { name: 'telefono', sample: '+1 555-123-4567', detected: true },
  { name: 'direccion', sample: 'Calle 123', detected: true },
  { name: 'fecha_nacimiento', sample: '1990-01-15', detected: true },
  { name: 'pais', sample: 'México', detected: true },
  { name: 'ciudad', sample: 'CDMX', detected: true },
  { name: 'numero_identificacion', sample: 'ID-45291', detected: true },
  { name: 'inicial_segundo_nombre', sample: 'A', detected: false },
  { name: 'codigo_postal', sample: '10001', detected: true },
  { name: 'puesto', sample: 'Ingeniero', detected: false },
]

export const standardFields: StandardField[] = [
  { name: 'Nombre Completo', type: 'string', required: true, description: 'Nombre completo de la persona' },
  { name: 'Email', type: 'email', required: true, description: 'Dirección de correo electrónico válida' },
  { name: 'Teléfono', type: 'phone', required: false, description: 'Número telefónico con código de país' },
  { name: 'Dirección', type: 'string', required: false, description: 'Dirección completa' },
  { name: 'Fecha', type: 'date', required: true, description: 'Fecha en formato ISO' },
  { name: 'País', type: 'string', required: true, description: 'Nombre o código del país' },
  { name: 'Ciudad', type: 'string', required: false, description: 'Nombre de la ciudad' },
  { name: 'ID Número', type: 'string', required: true, description: 'Identificador único' },
]

export const columnMappings: ColumnMapping[] = [
  { source: 'nombre + apellido', target: 'Nombre Completo', confidence: 'high', mapped: true },
  { source: 'correo_electronico', target: 'Email', confidence: 'high', mapped: true },
  { source: 'telefono', target: 'Teléfono', confidence: 'high', mapped: true },
  { source: 'direccion', target: 'Dirección', confidence: 'high', mapped: true },
  { source: 'fecha_nacimiento', target: 'Fecha', confidence: 'medium', mapped: true },
  { source: 'pais', target: 'País', confidence: 'high', mapped: true },
  { source: 'ciudad', target: 'Ciudad', confidence: 'high', mapped: true },
  { source: 'numero_identificacion', target: 'ID Número', confidence: 'high', mapped: true },
]

export const navItems: NavItem[] = [
  { label: 'Panel Principal', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Subir Archivo', href: '/upload', icon: 'Upload' },
  { label: 'Mapeo de Columnas', href: '/mapping', icon: 'GitCompare' },
  { label: 'Procesando Auditoría', href: '/processing', icon: 'Loader2' },
  { label: 'Resultados', href: '/validation', icon: 'ShieldCheck' },
  { label: 'Analíticas', href: '/analytics', icon: 'BarChart3' },
  { label: 'Reportes', href: '/reports', icon: 'FileText' },
  { label: 'Configuración', href: '/settings', icon: 'Settings' },
  { label: 'Ayuda', href: '/help', icon: 'HelpCircle' },
]
