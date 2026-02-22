import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// Storage helper for file uploads (receipts, attachments, etc.)
export class SupabaseStorageService {
    private readonly bucketName = 'gridbooks-files';

    async uploadFile(file: Buffer, path: string, contentType: string): Promise<string> {
        const { data, error } = await supabaseAdmin.storage
            .from(this.bucketName)
            .upload(path, file, {
                contentType,
                upsert: true,
            });

        if (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }

        return this.getPublicUrl(data.path);
    }

    async deleteFile(path: string): Promise<void> {
        const { error } = await supabaseAdmin.storage.from(this.bucketName).remove([path]);

        if (error) {
            throw new Error(`File deletion failed: ${error.message}`);
        }
    }

    getPublicUrl(path: string): string {
        const { data } = supabaseAdmin.storage.from(this.bucketName).getPublicUrl(path);
        return data.publicUrl;
    }
}

export const storageService = new SupabaseStorageService();
