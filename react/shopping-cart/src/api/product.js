// Fetch Pokémon from the PokéAPI and reshape them to look like shop
// "products" ({ id, title, price, image }) so ProductCard and Cart work unchanged.

const FIRST_ID = 1;
const COUNT = 20;

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function fetchOne(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon ${id} (${res.status})`);
  }
  const data = await res.json();

  // official-artwork looks best; fall back to the classic pixel sprite.
  const image =
    data.sprites.other["official-artwork"].front_default ??
    data.sprites.front_default;

  // Pokémon have no price, so invent a believable one from base_experience.
  const price = Number(((data.base_experience ?? 60) * 0.75).toFixed(2));

  return {
    id: data.id,
    title: capitalize(data.name),
    price,
    image,
  };
}

export async function fetchProducts() {
  const ids = Array.from({ length: COUNT }, (_, i) => FIRST_ID + i);
  return Promise.all(ids.map(fetchOne));
}
