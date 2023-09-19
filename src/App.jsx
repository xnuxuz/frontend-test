import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // init data for local storage
  let storage;
  // if local storage not have data
  if (!localStorage.getItem("data")) {
    storage = [];
  }else {
    storage = JSON.parse(localStorage.getItem("data"));
  }
  // data on local storage
  const [data, setData] = useState(storage);
  // state Add/Update Data 
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  // this for count qty and total price
  const [countQty, setCountQty] = useState(0);
  const [countPriceT, setCountPriceT] = useState(0);
  // this for select data may be updated
  const [key, setKey] = useState(0);
  // this for set which button will showing
  const [btnUpdate, setBtnUpdate] = useState(false);
  // set data to local storage
  const setLocalStorage = () => {
    localStorage.setItem("data", JSON.stringify(data));
  };
  // validation form input
  const formValidate = () => {
    if(name == '') alert('Product name invalid');
    else if(qty <= 0) alert('Product qty invalid');
    else if(price <= 0) alert('Product price invalid');
  }
  // reset form input after save/update
  function refreshForm(){
    setName('');
    setPrice(0);
    setQty(1);
    alert('Success Save');
  }
   // delete data from local storage
   const deleteData = (e) => {
    setData(value => {
      return value.filter((item,key) => key != e.target.value);
    });
    alert('Success Delete');
  }
  // get specific data by key/index array from local storage
  const selectData = (e) => {
    // update button will set to be true and change save button to update button
    setBtnUpdate(true);
    setKey(e.target.value);
    setName(data[e.target.value].name);
    setPrice(data[e.target.value].price);
    setQty(data[e.target.value].qty);
  }
  // submit data/add data to local storage
  const submitData = () => {
    if(name == '' || qty <= 0 || price <= 0){
      formValidate();
    }else{
      setData([...data, {name: name,price: price,qty: qty,total: total}]);
      refreshForm();
    }
  }
  // update data to local storage
  const updateData = () => {
    // update button will set to be false and change update button to save button
    setBtnUpdate(true);
    if(name == '' || qty <= 0 || price <= 0){
      formValidate();
    }else{
      data[key].name = name;
      data[key].price = price;
      data[key].qty = qty;
      data[key].total = total;
      refreshForm();
      setBtnUpdate(false);
    }
  }
  // set total price * qty
  const totalPriceQty = () => {
    setTotal(price*qty);
  }
  // set total qty & total price
  const countTotal = () => {
    let qtyTotal = 0, priceTotal = 0;
    data?.map(item => qtyTotal += parseInt(item.qty));
    data?.map(item => priceTotal += parseInt(item.total));
    setCountPriceT(priceTotal);
    setCountQty(qtyTotal);
  }
  // this function will running when data/price/qty state was updated
  useEffect(() => {
    setLocalStorage();
    totalPriceQty();
    countTotal();
  },[data, price, qty]);

  return (
    <div className="flex min-h-screen bg-base-300">
      <div className="card w-1/2 bg-base-100 shadow-xl rounded-none">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Input Form</h2>
          <form className="mt-10">
            <div className="flex flex-wrap">
              <label htmlFor="productname" className="text-sm m-2 ml-1">Product Name</label>
              <input type="text" id="productname" name="productname" value={name} onInput={(e) => setName(e.target.value)} placeholder="Product Name" className="input input-md input-bordered w-full max-w-md" />
            </div>
            <div className="flex flex-wrap">
              <label htmlFor="productprice" className="text-sm m-2 ml-1">Product Price</label>
              <input type="number" id="productprice" name="productprice" value={price} onInput={(e) => setPrice(e.target.value)} min="1" pattern = "[1-999999999999]" placeholder="Product Price" className="input input-md input-bordered w-full max-w-md" />
            </div>
            <div className="flex flex-wrap">
              <label htmlFor="productqty" className="text-sm m-2 ml-1">Product QTY</label>
              <input type="number" id="productqty" name="productqty" min="1" value={qty} onInput={(e) => setQty(e.target.value)} pattern = "[1-999999999999]" placeholder="Product QTY" className="input input-md input-bordered w-full max-w-md" />
            </div>
            <div className="flex flex-wrap">
              <label htmlFor="producttotal" className="text-sm m-2 ml-1">Total Price</label>
              <input type="number" id="producttotal" value={total} name="producttotal" readOnly placeholder="Total Price" className="input input-md input-bordered w-full max-w-md" />
            </div>
            <div className="mt-2">
              {/* update data button is avail when state update is true */}
              { btnUpdate && 
              <button type="button" onClick={updateData} className="btn btn-md w-full btn-outline btn-primary">Update</button> }
              { !btnUpdate &&
              <button type="button" onClick={submitData} className="btn btn-md w-full btn-outline btn-primary">Save</button> }
            </div>
          </form>
        </div>
      </div>
      <div className="h-screen">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-10">No</th>
                <th className="w-80">Product Name</th>
                <th className="w-80">Price</th>
                <th className="w-80">Qty</th>
                <th className="w-80">Total Price</th>
                <th className="w-80">Action</th>
              </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data?.map((item, key) => (
                  <tr key={key}>
                    <td>{key+1}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.qty}</td>
                    <td>{item.total}</td>
                    <th className="flex justify-items-center">
                      <button className="btn btn-warning btn-xs mr-2" value={key} onClick={selectData}>Update</button>
                      <button className="btn btn-error btn-xs" value={key} onClick={deleteData}>Delete</button>
                    </th>
                  </tr>
                )) : 
                <tr className="text-center">
                  <th colSpan={6} className="text-slate-500">No Data</th>
                </tr>
                }
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>Total</th>
                <th>{countQty}</th>
                <th>{countPriceT}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
