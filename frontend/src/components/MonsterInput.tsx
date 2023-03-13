import { useState } from "react";

function MonsterInput(props: any) {
  interface Monster {
    _id: string;
    name: string;
    image: string;
  }
  const [enteredMonsterName, setEnteredMonsterName] = useState("");

  function updateMonsterNameHandler(event: any) {
    setEnteredMonsterName(event.target.value);
  }

  function monsterSubmitHandler(event: any) {
    event.preventDefault();

    if (enteredMonsterName.trim().length === 0) {
      alert("Invalid Name - please enter a longer one!");
      return;
    }

    props.onAddMonster(enteredMonsterName);

    setEnteredMonsterName("");
  }

  return (
    <section id="monster-input">
      <form onSubmit={monsterSubmitHandler}>
        <label htmlFor="text">New Monster: </label>
        <input
          type="text"
          id="text"
          value={enteredMonsterName}
          onChange={updateMonsterNameHandler}
        />
        <div>
          <button>Add Monster</button>
        </div>
      </form>
    </section>
  );
}

export default MonsterInput;
