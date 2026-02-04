import type { Leiding, Verkenner } from "./Types";

export const getNaam = (input: Leiding|Verkenner) => {
    return input.Naam;
};

export const getNamen = (input: Leiding[]|Verkenner[]) => {
    return input?.map(item => getNaam(item)).join(", ");
};