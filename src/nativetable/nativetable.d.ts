// Type definitions for Nativetable v1.2.0
// Project: https://github.com/Mindsers/nativetable
// Definitions by: Nathanael CHERRIER <https://github.com/Mindsers>

declare module 'nativetable' {
    export class Nativetable {
        constructor(id: string, options?: {
            sources?: any[],
            filters?: {
                $and?: any,
                $or?: any
            },
            columns?: string[],
            pagination?: {
                maxLength?: number
            },
            sorting?: boolean
        });

        sources: any[];
        filtered: any[];
        paginated: any[];
        sorted: any[];

        columns: string[];
        pagination: { currentPage: number, maxLength: number};
        filters: { $and?: any, $or?: any };

        reload(row: any[]): void;
        draw(): void;
    }
}
