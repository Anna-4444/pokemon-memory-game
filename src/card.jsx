const Card = ({ poke, handleClick, shuffling }) => {
    return (
        <div onClick={() => handleClick(poke.id)} className={`card ${shuffling ? "shuffle" : ""}`}>
            <img src={poke.image} alt={poke.name} />
            <h4>{poke.name}</h4>
        </div>
    )
}

export default Card