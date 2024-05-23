// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../components/Loader/Loader";
// import NotFound from "../../components/NotFound/NotFound";
// import Card from "../../components/Card/Card";
// import styles from "./styles.module.css";

// const PageSellerProducts = (props) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const dispatch = useDispatch();
//     const { dataGetProdBySelId } = useSelector((state) => state.product);
//     const { getProfileStore } = useSelector((state) => state.auth);
//     console.log(getProfileStore)


//     useEffect(() => {
//         if (dataGetProdBySelId && dataGetProdBySelId.length > 0 && getProfileStore) {
//             setIsLoading(false);
//         }
//     }, [dataGetProdBySelId, getProfileStore]);

//     if (isLoading) {
//         return <Loader />;
//     }

//     if (!dataGetProdBySelId || dataGetProdBySelId.length === 0 || !getProfileStore || getProfileStore.length === 0) {
//         return <NotFound />;
//     }

//     const shop = getProfileStore[0];

//     return (
//         <div className={styles.body}>
//             {/* Seller Info Section */}
//             <div className={styles.user}>
//                 <img src={shop.avatar} alt="Seller Logo" />
//                 <h1>{shop.store_name}</h1>
//                 <p>{shop.store_desc}</p>
//             </div>

//             {/* Products Section
//             <div className={styles.productList}>
//                 {dataGetProdBySelId.map((product) => (
//                     <Card
//                         key={product.id}
//                         id={product.id}
//                         productImage={product.images.length > 0 ? product.images[0] : ''} // Ensure productImage is defined
//                         productName={product.name} // Pass product name
//                         productPrice={product.price} // Pass product price
//                         onClick={() => props.history.push(`/product/detail/${product.id}`)}
//                     />
//                 ))}
//             </div> */}
//         </div>
//     );
// };

// export default PageSellerProducts;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileStoreCreator } from "../../redux/actions/auth"; // Adjust the import as necessary
import Loader from "../../components/Loader/Loader";
import NotFound from "../../components/NotFound/NotFound";
import Card from "../../components/Card/Card";
import styles from "./styles.module.css";

const PageSellerProducts = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { dataGetProdBySelId } = useSelector((state) => state.product);
  const { sellerInfo } = useSelector((state) => state.auth);
console.log(sellerInfo, "")
  useEffect(() => {
    const sellerId = props.match.params.sellerId;
    console.log(sellerId)
    dispatch(getProfileStoreCreator(sellerId));
  }, [dispatch, props.match.params.sellerId]);

  useEffect(() => {
    if (dataGetProdBySelId && sellerInfo) {
      setIsLoading(false);
    }
  }, [dataGetProdBySelId, sellerInfo]);

  if (isLoading) {
    return <Loader />;
  }

  if (!dataGetProdBySelId || dataGetProdBySelId.length === 0 || !sellerInfo) {
    return <NotFound />;
  }

  const shop = sellerInfo;

  return (
    <div className={styles.body}>
      <div className={styles.user}>
        <img src={shop.avatar} alt="Seller Logo" />
        <h1>{shop.store_name}</h1>
        <p>{shop.store_desc}</p>
      </div>

      <div className={styles.productList}>
        {dataGetProdBySelId.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            productImage={product.images.length > 0 ? product.images[0] : ''}
            productName={product.name}
            productPrice={product.price}
            onClick={() => props.history.push(`/product/detail/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default PageSellerProducts;
