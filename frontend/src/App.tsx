import { useState, useEffect } from "react";
import "./App.css";
import Monsters_Inc_Logo from "./assets/monsters_inc_logo.png";
import MonsterInput from "./components/MonsterInput";
import AllMonsters from "./components/AllMonsters";

function App() {
  interface Monster {
    _id: string;
    name: string;
    image: string;
  }
  const [count, setCount] = useState<number>(0);
  const [monsters, setMonsters] = useState<[Monster]>([
    { _id: "", name: "", image: "" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api' + '/monsters');

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || 'Fetching the monsters failed.');
        }

        setMonsters(resData.monsters);
        setCount(resData.monsters.length)
      } catch (error: any) {
        setError(
          error.message ||
            'Fetching goals failed - the server responded with an error.'
        );
      }
      setIsLoading(false);
    }

    fetchData();
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
      console.log("🚀🚀🚀🚀 ~ file: App.tsx:66 ~ addMonsterHandler ~ resData:", resData)

      if (!response.ok) {
        throw new Error(resData.message || "Adding the monster failed.");
      }

      setMonsters((prevMonsters): [Monster] => {
        const updatedMonsters = [
          {
            _id: resData.monster._id,
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
      const response = await fetch(
        "http://localhost:8080/api/monsters/" + monsterId,
        {
          method: "DELETE",
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Deleting the monster failed.");
      }

      setMonsters((prevMonsters): [Monster] => {
        const updatedMonsters = prevMonsters.filter(
          (monster) => monster._id !== monsterId
        );
        return updatedMonsters as [Monster];
      });
    } catch (error: any) {
      setError(
        error.message ||
          "Deleting the monster failed - the server responded with an error."
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
          Monster count is {count ? count : 0}
        </button>
      </div>
      <h1> Monsters Inc.</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Work is out. Monsters have gone home</p>}
      <MonsterInput onAddMonster={addMonsterHandler} />
      <AllMonsters monsters={monsters} deleteMonsterHandler={deleteMonsterHandler}/>
    </div>
  );
}

export default App;
