export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    estate?: Estate;
}

export interface Estate {
    id: number;
    user_id: number;
    name: string;
    address: string;
    units_count: number;
    monthly_dues_amount: number;
    chairman_name: string;
    chairman_phone: string;
    chairman_email?: string;
    subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
    subscription_trial_ends_at?: string;
    created_at: string;
    updated_at: string;
    tenants?: Tenant[];
    payments?: Payment[];
    paid_count?: number;
    pending_count?: number;
    total_collected?: number;
}

export interface Tenant {
    id: number;
    estate_id: number;
    name: string;
    phone: string;
    email?: string;
    apartment_number: string;
    rent_amount: number;
    status: 'active' | 'inactive' | 'moved_out';
    created_at: string;
    updated_at: string;
    estate?: Estate;
    payments?: Payment[];
    current_payment?: Payment | null;
}

export interface Payment {
    id: number;
    tenant_id: number;
    estate_id: number;
    amount: number;
    period: string;
    status: 'pending' | 'paid' | 'overdue' | 'refunded';
    payment_method?: string;
    transaction_reference?: string;
    paid_at?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    tenant?: Tenant;
    estate?: Estate;
}

export interface DashboardStats {
    total_tenants: number;
    total_estates: number;
    paid_count: number;
    pending_count: number;
    total_collected: number;
    expected_total: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
