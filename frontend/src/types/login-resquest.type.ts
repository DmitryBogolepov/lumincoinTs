export type OperationType= {
    id: string;
    type: 'income' | 'expense' | string;
    category?: string;
    amount: number;
    date: string;
    comment?: string;
}