import React from "react";
import styles from "./main.module.css";
import MyOrder from "./MyOrder";
import MyProduct from "./MyProduct";
import OrderCancel from "./OrderCancel";
import MyStore from "./MyStore";

export default function Main(props) {
  const { nav, edit, setEdit } = props;
  return (
    <div className={styles.container}>
      {nav === "myproduct" ? <MyProduct /> : null}
      {nav === "myorder" ? <MyOrder /> : null}
      {nav === "ordercancel" ? <OrderCancel /> : null}
      {nav === "mystore" ? <MyStore /> : null}
    </div>
  );
}
