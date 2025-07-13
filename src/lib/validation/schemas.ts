import { z } from 'zod'

// API Number validation for oil & gas wells
export const apiNumberSchema = z.string()
  .regex(/^\d{2}-\d{3}-\d{5}$/, 'API number must be in format: XX-XXX-XXXXX')
  .refine(async (apiNumber) => {
    // Additional validation: check state code is valid
    const stateCode = apiNumber.substring(0, 2)
    const validStateCodes = ['42', '05', '06', '40', '22', '35', '49', '02'] // TX, CO, CA, OK, LA, NM, WY, AK
    return validStateCodes.includes(stateCode)
  }, 'Invalid state code in API number')

// Well data validation
export const wellDataSchema = z.object({
  apiNumber: apiNumberSchema,
  operatorName: z.string().min(1).max(255),
  fieldName: z.string().min(1).max(255).optional(),
  wellName: z.string().min(1).max(255).optional(),
  wellCount: z.number().int().positive().max(10000),
  commissionState: z.enum(['TX', 'CO', 'ND', 'OK', 'LA', 'NM', 'WY', 'AK']),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  wellType: z.enum(['oil', 'gas', 'oil_gas', 'injection', 'disposal']).optional(),
  wellStatus: z.enum(['active', 'inactive', 'plugged', 'abandoned', 'orphaned']).optional(),
})

// Project validation
export const projectSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(5000).optional(),
  type: z.enum(['methane-prevention', 'well-plugging', 'energy-efficiency', 'flare-reduction', 'water-treatment']),
  location: z.string().min(2).max(255),
  vintage_year: z.number().int().min(2020).max(new Date().getFullYear() + 5),
  total_credits: z.number().int().min(0).max(1000000),
  price_per_credit: z.number().positive().multipleOf(0.01).max(10000),
  certification_standard: z.string().optional(),
  api_number: apiNumberSchema.optional(),
  well_count: z.number().int().positive().optional(),
})

// Transaction validation
export const transactionSchema = z.object({
  project_id: z.string().uuid(),
  type: z.enum(['Purchase', 'Retirement', 'Transfer']),
  amount: z.number().positive().multipleOf(0.01).max(10000000),
  credits: z.number().int().positive().max(1000000),
  from_user_id: z.string().uuid().optional(),
  to_user_id: z.string().uuid().optional(),
}).refine((data) => {
  // Transfer requires both from and to
  if (data.type === 'Transfer') {
    return data.from_user_id && data.to_user_id
  }
  return true
}, 'Transfer transactions require both from_user_id and to_user_id')

// User registration validation
export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  full_name: z.string().min(2).max(100).optional(),
  user_type: z.enum(['project_developer', 'verifier', 'buyer', 'regulator', 'admin']),
  organization: z.string().min(2).max(255).optional(),
})

// Document upload validation
export const documentUploadSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().regex(/^[a-zA-Z0-9]+\/[a-zA-Z0-9\-\+\.]+$/, 'Invalid MIME type'),
  size: z.number().positive().max(50 * 1024 * 1024), // 50MB max
  category: z.enum(['Legal', 'Technical', 'Financial', 'Certification', 'Other']),
})

// Compliance check validation
export const complianceCheckSchema = z.object({
  project_id: z.string().uuid(),
  check_type: z.string().min(1).max(100),
  status: z.enum(['Pass', 'Fail', 'Pending']),
  details: z.record(z.any()).optional(),
  checked_by: z.string().uuid().optional(),
})

// Methane measurement validation
export const methaneMeasurementSchema = z.object({
  project_id: z.string().uuid(),
  measurement_date: z.string().datetime(),
  methane_rate: z.number().min(0).max(10000), // kg/day
  measurement_method: z.enum(['OGI', 'Method 21', 'Continuous Monitor', 'Satellite', 'Other']),
  equipment_id: z.string().optional(),
  weather_conditions: z.object({
    temperature: z.number().min(-50).max(60), // Celsius
    wind_speed: z.number().min(0).max(200), // km/h
    humidity: z.number().min(0).max(100), // percentage
  }).optional(),
  notes: z.string().max(1000).optional(),
})

// Financial validation
export const paymentSchema = z.object({
  amount: z.number().positive().multipleOf(0.01),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  payment_method: z.enum(['credit_card', 'bank_transfer', 'crypto']),
  reference: z.string().optional(),
})

// Search/Filter validation
export const searchParamsSchema = z.object({
  query: z.string().max(255).optional(),
  type: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  min_credits: z.number().int().min(0).optional(),
  max_credits: z.number().int().max(1000000).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().max(10000).optional(),
  state: z.array(z.string().length(2)).optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'price', 'credits', 'name']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).optional(),
})

// Helper function to validate data
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}