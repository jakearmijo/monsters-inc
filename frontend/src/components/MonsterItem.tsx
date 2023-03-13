function MonsterItem(props: any) {
  const { monster, onDelete } = props;
  return (
    <div className="monster">
      <h2>{monster.name}</h2>
      <img
        className="monster-pic"
        style={{ maxWidth: "7rem" }}
        src={monster.image}
      />
      <button onClick={onDelete.bind(null, monster._id)}>Delete Monster</button>
    </div>
  );
}

export default MonsterItem;
