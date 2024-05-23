import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import NotFound from "../../components/NotFound/NotFound";
import classname from "../../helpers/classJoiner";
import Card from "../../components/Card/Card";
import Img from "../../components/ImgWithContainer/ImgWithContainer";
import styles from "./styles.module.css";
import { getProfileStoreCreator } from "../../redux/actions/auth";
import { getProductBySellerIdCreator } from "../../redux/actions/product";
import defaultAvatar from "../../assets/img/logoshop.png"; // Thay đổi đường dẫn tùy theo nơi lưu trữ ảnh mặc định
import { API_URL } from "../../utils/environment";

const PageSellerProducts = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const { dataGetProdBySelId } = useSelector((state) => state.product);
    const { sellerInfo, isGetStoreProfilePending } = useSelector((state) => state.auth);

    useEffect(() => {
      const sellerId = props.match.params.id; 
      dispatch(getProfileStoreCreator(sellerId));
      dispatch(getProductBySellerIdCreator(sellerId));
    }, [dispatch, props.match.params.id]);

    useEffect(() => {
        if (!isGetStoreProfilePending && dataGetProdBySelId && sellerInfo) {
            setIsLoading(false);
        }
    }, [isGetStoreProfilePending, dataGetProdBySelId, sellerInfo]);

    if (isLoading) {
        return <Loader />;
    }

    if (!dataGetProdBySelId || dataGetProdBySelId.length === 0 || !sellerInfo || Object.keys(sellerInfo).length === 0) {
        return <NotFound />;
    }

    const onClickHandler = (id) => {
        props.history.push(`/product/detail/${id}`);
    };

    const shop = sellerInfo.length > 0 ? sellerInfo[0] : {};

    return (
      <div className={styles.body}>
          {/* Seller Info Section */}
          <div className={styles.user}>
            <Img
              source={`${API_URL}${shop.avatar}`|| defaultAvatar}
              containerStyle={styles.cardImgContainer}
              imgStyle={styles.cardImg}
            />
            <div className={styles.store}>
                <h1>{shop.store_name}</h1>
                <p>{shop.store_desc}</p>
            </div>
        </div>


          <h1>Products Section</h1>
          <div className="w-100">
            <div
              className={classname(
                "row",
                "no-gutters",
                "d-flex flex-row"
              )}
            >
              {dataGetProdBySelId.map((product) => (
                      <Card
                          key={product.id}
                          id={product.id}
                          image={product.images.length > 0 ? product.images[0] : ''}
                          name={product.name} 
                          price={product.price.toString()} 
                          seller_name={shop.store_name}
                          rate={product.rating || 0} 
                          onClickProp={() => onClickHandler(product.id)}
                      />
                  ))}
            </div>
          </div>
      </div>
  );
};

export default PageSellerProducts;
