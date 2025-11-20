const GameOptions = ({ handleGameMode, count, gameMode, time, formatTime, easyRecord, mediumRecord, hardRecord }) => {
    
    return (
        <section className="game-info">
            <div className="game-options">
                <div className="records">
                    <h2>Leader Board:</h2>
                    <div className="records-div">
                        <p>Easy Mode: {easyRecord === 0 ? "none" : formatTime(easyRecord)}</p>
                        <p>Medium Mode: {mediumRecord === 0 ? "none" : formatTime(mediumRecord)}</p>
                        <p>Hard Mode: {hardRecord === 0 ? "none" : formatTime(hardRecord)}</p>
                    </div>
                </div>
                <div className="mode">
                    <h2>Select Game Mode</h2>
                    <div className="button-div">
                        <button onClick={handleGameMode} value="8">Easy</button>
                        <button onClick={handleGameMode} value="12">Medium</button>
                        <button onClick={handleGameMode} value="16">Hard</button>
                    </div>
                </div>
            </div>
            <div className="current-stats">
                <div className="count-stats">
                    <h2>Current Count:</h2>
                    <p>{count} / {gameMode}</p>
                </div>
                <div className="time-stats">
                    <h2>Current Time:</h2>
                    <p>{formatTime(time)}</p>
                </div>
            </div>
        </section>
    )
}

export default GameOptions