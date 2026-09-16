import type { Leiding, Verkenner } from "./Types";

export const getNaam = (input: Leiding|Verkenner) => {
    return input.Naam;
};

export const getNamen = (input: Leiding[]|Verkenner[]) => {
    return input?.map(item => getNaam(item)).join(", ");
};

// mirrors the badge colors used for these values in the Google Sheet
const cwoColors: Record<string, string> = {
    'CWO I': '#cc0000',
    'CWO II': '#38761d',
    'CWO III': '#674ea7',
    'ZA': '#999999',
};

const vletColors: Record<string, string> = {
    'Fluessen': '#cc0000',
    'Brekken': '#1c4587',
    'Potten': '#f1c232',
    'Morra': '#38761d',
    'Leijen': '#999999',
};

export const getCwoColor = (value?: string) => cwoColors[value ?? ''] ?? '#999999';
export const getVletColor = (value?: string) => vletColors[value ?? ''] ?? '#999999';