import MonsterItem from "./MonsterItem";

function AllMonsters(props: any) {
  const { monsters, deleteMonsterHandler } = props;
  const hasNoMonsters = !monsters || monsters.length === 0;

  interface Monster {
    _id: string;
    name: string;
    image: string;
  }

  return (
    <div className="all-monsters">
      <h2>Your Monsters</h2>
      {hasNoMonsters && <h2>No Monsters found. Start adding some!</h2>}
      <section className="monster-collection">
        {monsters.map((monster: Monster) => (
          <MonsterItem
            key={monster._id}
            monster={monster}
            onDelete={deleteMonsterHandler}
          />
        ))}
      </section>
    </div>
  );
}

export default AllMonsters;
