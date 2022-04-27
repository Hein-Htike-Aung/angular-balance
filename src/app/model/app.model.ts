import { ChartType, Column } from "angular-google-charts";

export interface UserPayload {
    email: string;
    password: string;
    name?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CredentialInfoPayload {
    name: string;
    email: string;
    oldPassword: string;
    newPassword: string;
}

export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface AccountPayload {
    id?: string;
    name: string;
    openingBalance: number;
    description: string;

    createdAt?: string;
    updatedAt?: string;
}

export enum CategoryType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

export interface CategoryPayload {
    id?: string;
    name: string;
    type: CategoryType;
    description: string;

    subcategories?: CategoryPayload[];
    parentCategory?: CategoryPayload;
    balances: BalancePayload[];

    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryVO {
    category: string;
    subcategory: string | undefined;
    amount: number;
    type: CategoryType
}

export enum BalanceType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

export interface BalancePayload {
    id?: string;
    name: string;
    amount: number;
    date: Date;
    description?: string;
    balanceType: BalanceType;
    accountId: string;
    account?: AccountPayload;
    categoryId: string;
    category?: CategoryPayload;

    createdAt?: string;
    updatedAt?: string;
}

export interface GoogleChart {
    title: string;
    titleTextStyle?: {},
    type: ChartType;
    data: any[][];
    columns?: Column[];
    options: {};
}