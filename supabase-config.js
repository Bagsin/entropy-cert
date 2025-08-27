// Supabase configuration
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// Supabase client setup
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.headers = {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    async insert(table, data) {
        const response = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Supabase insert error: ${response.status}`);
        }
        
        return response.json();
    }

    async select(table, options = {}) {
        let url = `${this.url}/rest/v1/${table}`;
        
        if (options.eq) {
            const [column, value] = Object.entries(options.eq)[0];
            url += `?${column}=eq.${value}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.headers
        });
        
        if (!response.ok) {
            throw new Error(`Supabase select error: ${response.status}`);
        }
        
        return response.json();
    }

    async upsert(table, data) {
        const response = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Prefer': 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Supabase upsert error: ${response.status}`);
        }
        
        return response.json();
    }
}