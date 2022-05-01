export default function BudgetList(props) {
  return props.items.map((item, index) => {
    return (
      <tr
        key={index}
        className={item.source === "Income" ? "table-success" : "table-danger"}
      >
        <td align="left">
          {index} - {item.name}
        </td>
        <td>{item.quantity}</td>
        <td>{item.price}</td>
        <td>{item.source}</td>
        <td className="align-middle">{item.gross}</td>
        <td className="align-middle">
          <button
            className="btn btn-sm btn-danger px-2 py-0"
            onClick={() => props.onHandleRemoveItemClick(index)}
          >
            &times;
          </button>
        </td>
      </tr>
    );
  });
}
