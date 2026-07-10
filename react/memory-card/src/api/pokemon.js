const TOTAL_POKEMON = 151;

function getRandomIds(count){
    const ids=new Set();
    while(ids.size<count){
        const randomId=Math.floor(Math.random()*TOTAL_POKEMON)+1;
        ids.add(randomId);
    }
    return [...ids];
}

async function fetchOne(id){
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if(!res.ok){
        throw new Error(`Failed to fetch pokemon with id ${id}`);
    }
    const data = await res.json();
    // official-artwork is nicest, but it's null for some Pokémon —
    // fall back to the dream-world SVG, then the classic pixel sprite.
    const image =
        data.sprites.other['official-artwork'].front_default ??
        data.sprites.other.dream_world.front_default ??
        data.sprites.front_default;
    return {
        id: data.id,
        name: data.name,
        image,
    };
}
    
export async function fetchPokemon(count = 12){
    const ids= getRandomIds(count);
    return Promise.all(ids.map(fetchOne));
}