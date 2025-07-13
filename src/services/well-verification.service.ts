import { supabase } from '@/lib/supabase'
import { apiNumberSchema, wellDataSchema } from '@/lib/validation/schemas'
import { Database } from '@/lib/database.types'

type APINumber = Database['public']['Tables']['api_numbers']['Row']
type Commission = Database['public']['Tables']['commissions']['Row']

export interface WellVerificationResult {
  isValid: boolean
  wellData?: APINumber
  commission?: Commission
  message: string
  suggestions?: string[]
}

export class WellVerificationService {
  private static instance: WellVerificationService
  
  // State code mapping for API numbers
  private readonly stateCodeMap: Record<string, string> = {
    '02': 'AK', // Alaska
    '05': 'CO', // Colorado
    '06': 'CA', // California
    '22': 'LA', // Louisiana
    '35': 'NM', // New Mexico
    '40': 'OK', // Oklahoma
    '42': 'TX', // Texas
    '49': 'WY', // Wyoming
    '38': 'ND', // North Dakota
  }

  private constructor() {}

  static getInstance(): WellVerificationService {
    if (!this.instance) {
      this.instance = new WellVerificationService()
    }
    return this.instance
  }

  /**
   * Verify an API number against our database and external sources
   */
  async verifyAPINumber(apiNumber: string): Promise<WellVerificationResult> {
    try {
      // Validate format
      const validation = await apiNumberSchema.safeParseAsync(apiNumber)
      if (!validation.success) {
        return {
          isValid: false,
          message: 'Invalid API number format. Expected format: XX-XXX-XXXXX',
          suggestions: ['Check that your API number has 2 digits, followed by 3 digits, followed by 5 digits'],
        }
      }

      // Extract state code
      const stateCode = apiNumber.substring(0, 2)
      const state = this.stateCodeMap[stateCode]
      
      if (!state) {
        return {
          isValid: false,
          message: `Unknown state code: ${stateCode}`,
          suggestions: Object.entries(this.stateCodeMap).map(
            ([code, st]) => `${code} = ${st}`
          ),
        }
      }

      // Check our database first
      const { data: apiData, error: apiError } = await supabase
        .from('api_numbers')
        .select(`
          *,
          commission:commissions(*)
        `)
        .eq('api_number', apiNumber)
        .single()

      if (apiData && !apiError) {
        return {
          isValid: true,
          wellData: apiData,
          commission: apiData.commission,
          message: 'API number verified successfully',
        }
      }

      // If not in database, check if commission exists for state
      const { data: commission } = await supabase
        .from('commissions')
        .select('*')
        .eq('state', state)
        .single()

      if (commission) {
        // API number not in our database but state is valid
        return {
          isValid: true,
          commission,
          message: 'API number format is valid. Well data not found in our database.',
          suggestions: [
            'You can proceed with manual entry of well details',
            `Contact ${commission.name} for official well records`,
          ],
        }
      }

      return {
        isValid: false,
        message: 'Unable to verify API number',
        suggestions: ['Contact support for assistance'],
      }
    } catch (error) {
      console.error('API verification error:', error)
      return {
        isValid: false,
        message: 'An error occurred during verification',
        suggestions: ['Please try again later'],
      }
    }
  }

  /**
   * Add or update well data in our database
   */
  async registerWell(wellData: typeof wellDataSchema._type): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate well data
      const validation = await wellDataSchema.safeParseAsync(wellData)
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors.map(e => e.message).join(', '),
        }
      }

      // Get commission for state
      const { data: commission } = await supabase
        .from('commissions')
        .select('id')
        .eq('state', wellData.commissionState)
        .single()

      if (!commission) {
        return {
          success: false,
          error: 'Invalid state commission',
        }
      }

      // Upsert well data
      const { error } = await supabase
        .from('api_numbers')
        .upsert({
          api_number: wellData.apiNumber,
          commission_id: commission.id,
          operator_name: wellData.operatorName,
          field_name: wellData.fieldName,
          well_name: wellData.wellName,
          well_status: wellData.wellStatus,
          latitude: wellData.latitude,
          longitude: wellData.longitude,
        })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Well registration error:', error)
      return {
        success: false,
        error: 'Failed to register well',
      }
    }
  }

  /**
   * Search for wells by various criteria
   */
  async searchWells(criteria: {
    state?: string
    operator?: string
    field?: string
    status?: string
  }): Promise<APINumber[]> {
    try {
      let query = supabase.from('api_numbers').select('*')

      if (criteria.state) {
        const { data: commission } = await supabase
          .from('commissions')
          .select('id')
          .eq('state', criteria.state)
          .single()
        
        if (commission) {
          query = query.eq('commission_id', commission.id)
        }
      }

      if (criteria.operator) {
        query = query.ilike('operator_name', `%${criteria.operator}%`)
      }

      if (criteria.field) {
        query = query.ilike('field_name', `%${criteria.field}%`)
      }

      if (criteria.status) {
        query = query.eq('well_status', criteria.status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Well search error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Well search error:', error)
      return []
    }
  }

  /**
   * Get well statistics by state
   */
  async getWellStatsByState(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('api_numbers')
        .select(`
          commission_id,
          commissions!inner(state)
        `)

      if (error) {
        console.error('Stats query error:', error)
        return {}
      }

      const stats: Record<string, number> = {}
      
      data?.forEach(record => {
        const state = record.commissions?.state
        if (state) {
          stats[state] = (stats[state] || 0) + 1
        }
      })

      return stats
    } catch (error) {
      console.error('Well stats error:', error)
      return {}
    }
  }

  /**
   * Validate well coordinates
   */
  validateCoordinates(lat: number, lon: number, state: string): boolean {
    // Basic US boundary check
    const isInUS = lat >= 24.396308 && lat <= 49.384358 && 
                   lon >= -125.001651 && lon <= -66.93457

    if (!isInUS) return false

    // State-specific boundary validation (simplified)
    const stateBounds: Record<string, { minLat: number; maxLat: number; minLon: number; maxLon: number }> = {
      TX: { minLat: 25.84, maxLat: 36.50, minLon: -106.65, maxLon: -93.51 },
      CO: { minLat: 36.99, maxLat: 41.00, minLon: -109.06, maxLon: -102.04 },
      ND: { minLat: 45.93, maxLat: 49.00, minLon: -104.05, maxLon: -96.55 },
      // Add more states as needed
    }

    const bounds = stateBounds[state]
    if (!bounds) return isInUS

    return lat >= bounds.minLat && lat <= bounds.maxLat &&
           lon >= bounds.minLon && lon <= bounds.maxLon
  }
}