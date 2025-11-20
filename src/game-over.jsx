const GameOverModal = ({ message, handlePlayAgain }) => {
    return (
        <div className="gameover-overlay">
            <section className="gameover-modal">
                <h2>{message}</h2>
                <button onClick={handlePlayAgain}>Play Again</button>
            </section>
        </div>
        
    )
}

export default GameOverModal