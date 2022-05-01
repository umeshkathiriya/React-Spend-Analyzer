import { useEffect, useState } from "react";
import BudgetList from "./BudgetList";
import { PieChart } from "react-minimal-pie-chart";

export default function BudgetAnalyser() {
  const [itemList, setItemList] = useState(
    () => JSON.parse(localStorage.getItem("item_list")) ?? []
  );
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);
  const [itemSource, setItemSource] = useState("Income");
  const [itemGross, setItemGross] = useState(0);
  const [itemTotal, setItemTotal] = useState(0);
  const [validateItem, setValidateItem] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [spendTotal, setSpendTotal] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  const defaultLabelStyle = {
    fill: "#333",
    fontSize: "5px",
    fontFamily: "sans-serif"
  };

  useEffect(() => {
    setItemGross(itemQuantity * itemPrice);
  }, [itemQuantity, itemPrice]);

  useEffect(() => {
    setItemTotal(
      itemList.reduce((total = 0, current) => {
        if (current.source === "Income") {
          return (total += current.gross);
        } else {
          return (total -= current.gross);
        }
      }, 0)
    );
    localStorage.setItem("item_list", JSON.stringify(itemList));

    setSpendTotal(
      itemList.reduce((total, current) => {
        if (current.source === "Expense") {
          total += current.gross;
        }
        return total;
      }, 0)
    );
    setIncomeTotal(
      itemList.reduce((total = 0, current) => {
        if (current.source === "Income") {
          total += current.gross;
        }
        return total;
      }, 0)
    );
  }, [itemList, itemTotal, spendTotal, incomeTotal]);

  useEffect(() => {
    const chartFilterData = itemList.map((item) => {
      let newColor = item.source === "Income" ? "#198754" : "#dc3545";
      return {
        name: item.name,
        value: item.gross,
        color: newColor
      };
    });
    setChartData(chartFilterData);
  }, [itemList]);

  function handleItemNameChange(e) {
    setItemName(e.target.value);
  }
  function handleItemQuantityChange(e) {
    setItemQuantity(e.target.value);
  }
  function handleItemPriceChange(e) {
    setItemPrice(e.target.value);
  }
  function handleItemSourceChange(e) {
    setItemSource(e.target.value);
  }

  function handleAddItemClick() {
    if (itemName !== "") {
      setItemList([
        ...itemList,
        {
          name: itemName,
          quantity: itemQuantity,
          price: itemPrice,
          source: itemSource,
          gross: itemGross
        }
      ]);
      // clear item previous details
      setItemName("");
      setItemQuantity("");
      setItemPrice("");
      setItemGross("");
      setValidateItem(false);
    } else {
      setValidateItem(true);
    }
  }

  function handleRemoveItemClick(id) {
    setItemList(itemList.filter((item, index) => index !== id && item));
  }

  return (
    <>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th width="100">Quantity</th>
            <th width="120">Price</th>
            <th width="100">Income/Expense</th>
            <th>Gross</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={!validateItem ? "" : "was-validated"}>
              <input
                type="text"
                name="itemName"
                placeholder="Enter Item"
                className="form-control"
                value={itemName}
                onChange={handleItemNameChange}
                required
              />
            </td>
            <td>
              <input
                type="number"
                size="20"
                name="itemQuantity"
                placeholder="Enter Quantity"
                className="form-control"
                value={itemQuantity}
                onChange={handleItemQuantityChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="itemPrice"
                placeholder="Enter Price"
                className="form-control"
                value={itemPrice}
                onChange={handleItemPriceChange}
              />
            </td>
            <td>
              <select
                name="selectAccount"
                className="form-select"
                onChange={handleItemSourceChange}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </td>
            <td className="align-middle">{itemGross}</td>
            <td className="align-middle">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAddItemClick}
              >
                Add Item
              </button>
            </td>
          </tr>
          <tr className="table-dark">
            <td colSpan="3" align="left">
              {validateItem && (
                <span className="invalid-feedback">
                  Please enter Item Name.
                </span>
              )}
            </td>
            <td align="right">
              <b>Total Saving $</b>
            </td>
            <td>
              <b>{itemTotal}</b>
            </td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <BudgetList
            items={itemList}
            onHandleRemoveItemClick={handleRemoveItemClick}
          />
        </tfoot>
      </table>
      <div className="row justify-content-center">
        <div className="col-4 py-3">
          <h5>All Income/Expense</h5>
          {itemTotal === 0 ? (
            <p>No item added</p>
          ) : (
            <PieChart
              radius={35}
              lineWidth={40}
              paddingAngle={5}
              data={chartData}
              label={({ dataEntry }) => `${dataEntry.value}`}
              labelStyle={{ ...defaultLabelStyle }}
              labelPosition={110}
              animate
            />
          )}
        </div>
        <div className="col-4 py-3">
          <h5>Total Income/Expense</h5>
          {itemTotal === 0 ? (
            <p>No item added</p>
          ) : (
            <PieChart
              radius={30}
              lineWidth={40}
              paddingAngle={0}
              startAngle={180}
              lengthAngle={180}
              data={[
                {
                  title: "Income",
                  value: incomeTotal,
                  color: "#198754"
                },
                {
                  title: "Expense",
                  value: spendTotal,
                  color: "#dc3545"
                }
              ]}
              label={({ dataEntry }) => `${dataEntry.value}`}
              labelStyle={{ ...defaultLabelStyle }}
              labelPosition={110}
              animate
            />
          )}
        </div>
      </div>
    </>
  );
}
