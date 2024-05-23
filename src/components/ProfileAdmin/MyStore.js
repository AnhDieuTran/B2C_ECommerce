import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./myorder.module.css";
import empty from "../../assets/image/emptyorder.png";
import sort from "../../assets/image/sort.png";
import { Table } from "react-bootstrap";
import { getSellerAdminCreator } from '../../redux/actions/product';

export default function MyStore() {
    const dispatch = useDispatch();
  const { store } = useSelector((state) => state.product);
  console.log("...1...",store)

  useEffect(() => {
    dispatch(getSellerAdminCreator(1));
  }, [dispatch]);
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h6 className={styles.title}>All store</h6>
      </div>
      <div className={styles.content}>
        <div className={styles.order}>
          {store ? (
            store.length ? (
              <Table striped border hover>
                <thead
                  style={{ backgroundColor: "#F7F7F7", border: "none" }}
                  className={styles.headertable}>
                  <tr>
                    <th style={{ width: "10%" }}>No.</th>
                    <th style={{ width: "30%" }}>Store Name <img src={sort} /></th>
                    <th style={{ width: "20%" }}>Phone <img src={sort} alt="Sort" /></th>
                    <th style={{ width: "20%", textAlign: "center" }}>Total product <img src={sort} /></th>
                    <th style={{ width: "20%", textAlign: "center" }}>Sales <img src={sort} /></th>
                  </tr>
                </thead>
                <tbody borderless>
                  {store.map((item, index) => {
                    // let dates = item.date;
                    return (
                      <tr key={index.toString()}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.phone_number}</td>
                        <td style={{ width: "20%", textAlign: "center" }}>{item.total_product}</td>
                        <td style={{ width: "20%", textAlign: "center" }}>{item.sales}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <img className={styles.empty} src={empty} alt='' />
            )
          ) : (
            <img className={styles.empty} src={empty} alt='' />
          )}
        </div>
      </div>
      {/* Content */}
      {/* ............... */}
    </div>
  );
}
