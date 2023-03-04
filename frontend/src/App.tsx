import { useState, useEffect } from "react";
import "./App.css";
import Monsters_Inc_Logo from "./assets/monsters_inc_logo.png";
import MonsterInput from "./components/MonsterInput";

function App() {
  interface Monster {
    id: string;
    name: string;
    image: string;
  }
  const [count, setCount] = useState<number>(0);
  const [monsters, setMonsters] = useState<[Monster]>([
    { id: "", name: "", image: "" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/monsters")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("🚀🚀🚀🚀 ~ file: App.tsx:25 ~ .then ~ data:", data)
        setMonsters(data.monsters);
        setCount(data.monsters.length);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function addMonsterHandler(monsterName: string) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/monsters", {
        method: "POST",
        body: JSON.stringify({
          name: monsterName,
          image: `https://robohash.org/${monsterName.replace(
            /\s/g,
            ""
          )}?set=set2`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Adding the monster failed.");
      }

      setMonsters((prevMonsters): [Monster] => {
        const updatedMonsters = [
          {
            id: resData.monster.id,
            name: resData.monster.name,
            image: resData.monster.image,
          },
          ...prevMonsters,
        ];
        return updatedMonsters as [Monster];
      });
    } catch (error: any) {
      setError(
        error.message ||
          "Adding a goal failed - the server responded with an error."
      );
    }
    setIsLoading(false);
  }

  async function deleteMonsterHandler(monsterId: string) {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/api/monsters/' + monsterId, {
        method: 'DELETE',
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Deleting the goal failed.');
      }

      setMonsters((prevMonsters): [Monster] => {
        const updatedMonsters = prevMonsters.filter((monster) => monster.id !== monsterId);
        return updatedMonsters as [Monster];
      });
    } catch (error: any) {
      setError(
        error.message ||
          'Deleting the monster failed - the server responded with an error.'
      );
    }
    setIsLoading(false);
  }

  return (
    <div className="App">
      <div>
        <a href="https://jakearmijo.com" target="_blank">
          <img
            src={Monsters_Inc_Logo}
            className="logo"
            alt="Monsters Inc logo"
          />
        </a>
      </div>
      <h1>Welcome to Monsters, Inc.</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Monster count is {count ? 0 : count}
        </button>
      </div>
      <h1> Monsters Inc.</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Work is out. Monsters have gone home</p>}
      <MonsterInput onAddMonster={addMonsterHandler} />
      <div className="monster-collection">
        {monsters.map((monster: Monster) => (
          <div key={monster.id} className="monster">
            <h2>{monster.name}</h2>
            <img
              className="monster-pic"
              style={{ maxWidth: "7rem" }}
              src={monster.image}
            />
            {monsters.length > 1 && (
              <button onClick={() => deleteMonsterHandler}>
                Delete Monster
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
