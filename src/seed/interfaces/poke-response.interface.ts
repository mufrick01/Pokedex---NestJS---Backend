export interface PokeResponse {
    count:    number;
    next:     string;
    previous: null;
    results:  pokemonResult[];
}

export interface pokemonResult {
    name: string;
    url:  string;
}
