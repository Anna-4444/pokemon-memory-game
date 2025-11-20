import Card from "./card.jsx";

const PokemonCards = ({ pokemonList, handleClick, shuffling }) => {
    return (
        <section className="pokemon-cards-container">
            {pokemonList.map((poke) => (
                <Card 
                    key={poke.id} 
                    poke={poke} 
                    handleClick={handleClick} 
                    shuffling={shuffling}
                />
            ))}
        </section>
    )
}

export default PokemonCards