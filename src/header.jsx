import pokemonLogo from "./assets/pokemon-logo.jpg";

const Header = () => {
    return (
        <section className="header">
            <img src={pokemonLogo} alt="pokemon logo"></img>
            <div className="subtitle">
                <h2>Memory Game</h2>
                <h3>Click each card only once. If you click the same card twice, you lose.</h3>
            </div>  
        </section>
    );
};

export default Header