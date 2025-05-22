import fs from 'fs';
import { supabaseService } from './supabase_service';

export class SupabaseStoreService {
    constructor({ churchId }) {
        if (!churchId) throw new Error('churchId is required for SupabaseStore.');
        this.churchId = churchId;
        this.table = 'WHATSAPP_SESSION';
    }

    async sessionExists(options) {
        const { session } = options;

        const { data, error } = await supabaseService
            .getClient()
            .from(this.table)
            .select('id')
            .eq('clientId', session)
            .single();

        return !!data && !error;
    }

    async save(options) {
        const { session } = options;

        // Lê o .zip local e transforma em base64
        const zipBuffer = fs.readFileSync(`${session}.zip`);
        const base64Zip = zipBuffer.toString('base64');

        const { data: existing } = await supabaseService
            .getClient()
            .from(this.table)
            .select('id')
            .eq('clientId', session)
            .single();

        if (existing) {
            await supabaseService
                .getClient()
                .from(this.table)
                .update({
                    sessionData: { base64: base64Zip },
                    updateTimestamp: new Date()
                })
                .eq('clientId', session);
        } else {
            await supabaseService
                .getClient()
                .from(this.table)
                .insert({
                    churchId: this.churchId,
                    clientId: session,
                    sessionData: { base64: base64Zip }
                });
        }
    }

    async extract(options) {
        const { session, path } = options;

        const { data, error } = await supabaseService
            .getClient()
            .from(this.table)
            .select('sessionData')
            .eq('clientId', session)
            .single();

        if (error || !data || !data.sessionData) {
            throw new Error(`Session not found for extract: ${session}`);
        }

        const base64Zip = data.sessionData.base64;
        const zipBuffer = Buffer.from(base64Zip, 'base64');

        fs.writeFileSync(path, zipBuffer);
    }

    async delete(options) {
        const { session } = options;

        const { error } = await supabaseService
            .getClient()
            .from(this.table)
            .delete()
            .eq('clientId', session);

        if (error) {
            console.error('SupabaseStore delete error:', error);
        }
    }
}
