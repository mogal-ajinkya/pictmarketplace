import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { message } from "antd";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

function Home() {
  const [search,setSearch] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: "approved",
    name : "",
    category: [],
    age: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    // console.log(filters)
    getData();
  }, [filters]);

  return (
    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-equalizer-line text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
          <div className="flex gap-1 items-center w-full">
          <input
            type="text"
            placeholder="Search Products  here..."
            className="border border-gray-300 rounded border-solid px-2 py-1 h-8 w-full"
            value={search}
            onChange={(e)=>{
              setSearch(e.target.value);
            }}
          />
          <div onClick={()=>{
            setFilters({
                ...filters,
                name:search,
              });
          }}
          className="flex justify-center items-center border border-gray-400 rounded border-solid px-2 h-12 py-1 w-12">
              <i className="ri-search-line" ></i>
          </div>
          </div>
        </div>
        <div
          className={`
        grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}
      `}
        >
          {products?.map((product) => {
            return (
              <div
                className="border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer "
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0]}
                  className="w-full h-52 p-2 rounded-md  object-contain "
                  alt=""
                />

                <div className="px-2 flex flex-col">
                  <h1 className="text-lg font-semibold">{product.name}</h1>
                  <p className="text-sm">
                    {product.age} {' '}
                    {product.age === 1 ? " year" : " years"} {' '}
                    old
                  </p>
                  <Divider />
                  <span className="text-xl font-semibold text-green-700">
                    Rs. {product.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
