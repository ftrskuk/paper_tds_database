'use server'

import { createClient } from "@/lib/supabase/server"

export type PaperSpec = {
    manufacturer: string
    product_name: string
    basis_weight: number
    thickness: number
    whiteness: number
    smoothness: number
    cobb_value: number
    tensile_strength_md: number
    tensile_strength_cd: number
    tearing_strength_md: number
    tearing_strength_cd: number
    extra_specs: Record<string, any>
    tds_file_url?: string
}

export async function saveSpecsAction(specs: PaperSpec[]) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('paper_specs')
            .insert(specs)
            .select()

        if (error) {
            console.error('Supabase insert error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Save specs error:', error)
        return { success: false, error: 'Failed to save specifications' }
    }
}
