import { useState, useEffect } from 'react';
import { Loader } from "react-feather";

import Header from "./header.jsx";
import GameOptions from "./game-options.jsx";
import PokemonCards from './pokemonCards.jsx';
import GameOverModal from './game-over.jsx';
import Footer from "./footer.jsx";
import { shufflePokemonList, formatTime } from "./helpers.jsx";
import "./app.css";

const App = () => {
  // Game state  
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameMode, setGameMode] = useState(8);
  const [count, setCount] = useState(0);
  const [clickedIds, setClickedIds] = useState(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [shuffling, setShuffling] = useState(false);
  // Timer
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  //Records
  const [easyRecord, setEasyRecord] = useState(() => JSON.parse(localStorage.getItem("easy-record")) || 0);
  const [mediumRecord, setMediumRecord] = useState(() => JSON.parse(localStorage.getItem("medium-record")) || 0);
  const [hardRecord, setHardRecord] = useState(() => JSON.parse(localStorage.getItem("hard-record")) || 0);
  
  const fetchPokemon = async () => {
    try {
      setLoading(true)

      //Fetch Pokemon List, limit=100
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
      if (!response.ok) throw new Error(`HTTP error: Status ${response.status}`);
      const data = await response.json();

      // Shuffle the list and select the correct number for gameMode, (8, 12, or 16)
      const selectedPokemon = shufflePokemonList(data.results).slice(0, gameMode);

      //Fetch detailed Pokémon data for each selected pokemon
      const detailed = await Promise.all(
        selectedPokemon.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          if (!res.ok) throw new Error(`HTTP error: Status ${res.status}`);
          const detailedData = await res.json();

          return {
            id: detailedData.id,
            name: detailedData.name,
            image: detailedData.sprites.other["official-artwork"].front_default,
          }
        })
      );

      setPokemonList(detailed);
    
    } catch (err) {
      console.log("Error fetching pokemon", err.message)
      setPokemonList([]);

    } finally {
      setLoading(false);
    }  
  }

  //Fetch Pokemon on mount and when gameMode changes
  useEffect(() => {
    fetchPokemon();
  }, [gameMode]);

  //Animate cards with each shuffle
  useEffect(() => {
    setShuffling(true);
    const timeout = setTimeout(() => setShuffling(false), 350);
    return () => clearTimeout(timeout);
  }, [pokemonList]);

  //Timer
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive])

  //Local storage for records
  useEffect(() => {
    localStorage.setItem("easy-record", JSON.stringify(easyRecord))
  }, [easyRecord]);

  useEffect(() => {
    localStorage.setItem("medium-record", JSON.stringify(mediumRecord))
  }, [mediumRecord]);

  useEffect(() => {
    localStorage.setItem("hard-record", JSON.stringify(hardRecord))
  }, [hardRecord]);

  //Game Logic
  const handleClick = (id) => {
    if (!timerActive) setTimerActive(true);
    if (clickedIds.has(id)) return handleGameover("lost");
    setClickedIds((prev) => new Set(prev).add(id))
    if (count === gameMode - 1) {
      setCount((c) => c + 1)
      return handleGameover("win");
    }
    setCount((c) => c + 1)
    setPokemonList((prev) => shufflePokemonList(prev));
  };

  const handleGameMode = (e) => {
    const newMode = Number(e.target.value);
    if (newMode === gameMode) {
      gameReset();
      fetchPokemon();
    } else {
      gameReset();
      setGameMode(newMode);
    }
  }

  const handleGameover = (result) => {
    setTimerActive(false);
    if (result === "lost") {
      setMessage("Game over! You already clicked that one!")
    } else {
      const isRecord = checkRecord(time);
      isRecord 
        ? setMessage(`You won! TIME: ${formatTime(time)} NEW RECORD!`)
        : setMessage(`You won! TIME: ${formatTime(time)}`)
    }
    setGameOver(true);
  }
  
  const handlePlayAgain = () => {
    gameReset();
    fetchPokemon();
  }

  const gameReset = () => {
    setPokemonList([]); 
    setCount(0);
    setClickedIds(new Set());
    setGameOver(false);
    setMessage("");
    setTime(0); 
    setTimerActive(false); 
  }

  const checkRecord = (t) => {
    if (gameMode === 8 && easyRecord === 0 || t < easyRecord) {
      setEasyRecord(t);
      return true;
    } 
     if (gameMode === 12 && mediumRecord === 0 || t < mediumRecord) {
      setMediumRecord(t);
      return true;
    } 
     if (gameMode === 16 && hardRecord === 0 || t < hardRecord) {
      setHardRecord(t);
      return true;
    } 
    return false;
  }

  return (
    <div>
      <Header />
      
      <main>
        {gameOver && <GameOverModal message={message} handlePlayAgain={handlePlayAgain}/>}
        
        <GameOptions 
          handleGameMode={handleGameMode} 
          count={count} 
          gameMode={gameMode} 
          time={time} 
          formatTime={formatTime} 
          easyRecord={easyRecord} 
          mediumRecord={mediumRecord} 
          hardRecord={hardRecord}
        />

        {loading ? (
          <Loader />
        ) : (
          <PokemonCards 
            pokemonList={pokemonList} 
            handleClick={handleClick} 
            shuffling={shuffling}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App