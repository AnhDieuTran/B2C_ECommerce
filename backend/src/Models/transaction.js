const db = require("../Configs/dbMysql");

const { DateTime } = require("luxon");

const getTransQueryCustomer =
	`SELECT c.name as user_name, t.id as transaction_id, amount, payment_method, address, date, p.name, pi.img, tp.qty as qty,
	t.amount as total_amount
	FROM transaction t JOIN customer c ON t.customer_id = c.id JOIN seller s ON s.id = t.seller_id JOIN trans_pvt tp  ON tp.transaction_id = t.id JOIN product p ON p.id = tp.product_id  JOIN product_img pi ON pi.product_id = p.id 
	
	WHERE c.id = ?
	GROUP BY 
		t.id, c.name;`


const getTransQuerySeller =
	`SELECT customer.name as user_name, transaction.id as transaction_id, amount, payment_method, address, date, product.name, product_img.img, trans_pvt.qty as qty, transaction.amount as total_amount FROM transaction JOIN trans_pvt ON trans_pvt.transaction_id = transaction.id JOIN customer ON customer.id = transaction.customer_id JOIN product ON product.id = trans_pvt.product_id JOIN product_img ON product_img.product_id = product.id JOIN seller ON seller.id = transaction.seller_id
	WHERE transaction.seller_id = ? GROUP BY transaction.id`;
const getTransQueryAdmin = 
`SELECT customer.name as user_name, transaction.id as transaction_id, payment_method, date, product.name, transaction.amount as total_amount FROM transaction JOIN trans_pvt ON trans_pvt.transaction_id = transaction.id JOIN customer ON customer.id = transaction.customer_id LEFT JOIN product ON product.id = trans_pvt.product_id
GROUP BY transaction.id`;
const getSellerQueryAdmin = 
	`SELECT s.*, COUNT(DISTINCT p.id) AS totalProduct, SUM(DISTINCT t.amount) AS sales FROM seller s 
	JOIN transaction t ON t.seller_id = s.id
	JOIN product p ON p.seller_id = s.id 
	GROUP BY s.id`;

const transactionModel = {
	alignHelper: function (data) {

		let arrayOfOrder = [[]];
		let objRes = [];
		let lastElement = {};
		let orderIdx = 0;
		let dataLength = data.length;
		for (let i = 0; i < dataLength; i++) {
			if (i === 0) {
				arrayOfOrder[orderIdx].push({
					name: data[i].name,
					image: data[i].img,
					qty: data[i].qty,
				});
				lastElement = data[i];
			} else if (data[i].transaction_id !== lastElement.transaction_id) {
				objRes[orderIdx] = [];
				objRes[orderIdx] = {
					transaction_id: lastElement.transaction_id,
					name: lastElement.user_name,
					payment_method: lastElement.payment_method,
					address: lastElement.address ? lastElement.address : "",
					date: lastElement.date,
					products: arrayOfOrder[orderIdx],
					amount: lastElement.total_amount,
				};
				orderIdx++;
				arrayOfOrder[orderIdx] = [];
				arrayOfOrder[orderIdx].push({
					name: data[i].name,
					image: data[i].img,
					qty: data[i].qty,
				});
				lastElement = data[i];
			} else {
				arrayOfOrder[orderIdx].push({
					name: data[i].name,
					image: data[i].img,
					qty: data[i].qty,
				});
				lastElement = data[i];
			}
			if (i === dataLength - 1) {
				objRes[orderIdx] = {};
				objRes[orderIdx] = {
					transaction_id: lastElement.transaction_id,
					name: lastElement.user_name,
					payment_method: lastElement.payment_method,
					address: lastElement.address ? lastElement.address : "",
					date: lastElement.date,
					products: arrayOfOrder[orderIdx],
					amount: lastElement.total_amount,
				};
			}
		}
		return objRes;
	},
	sellerAdminAlignHelper: function (data) {

		let arrayOfOrder = [[]];
		let objRes = [];
		let lastElement = {};
		let orderIdx = 0;
		let dataLength = data.length;
		for (let i = 0; i < dataLength; i++) {
			if (i === 0) {
				arrayOfOrder[orderIdx].push({
					name: data[i].name,
					image: data[i].avatar,
				});
				lastElement = data[i];
			} else if (data[i].id !== lastElement.id) {
				objRes[orderIdx] = [];
				objRes[orderIdx] = {
					id: lastElement.id,
					name: lastElement.name,
					store_name: lastElement.store_name,
					phone_number: lastElement.phone_number,
					description: lastElement.store_desc,
					total_product: lastElement.totalProduct,
					sales: lastElement.sales
				};
				orderIdx++;
				arrayOfOrder[orderIdx] = [];
				arrayOfOrder[orderIdx].push({
					name: data[i].name,
					image: data[i].avatar,
				});
				lastElement = data[i];
			} else {
				arrayOfOrder[orderIdx].push({
					name: data[i].name,
					image: data[i].avatar,
				});
				lastElement = data[i];
			}
			if (i === dataLength - 1) {
				objRes[orderIdx] = {};
				objRes[orderIdx] = {
					id: lastElement.id,
					name: lastElement.name,
					store_name: lastElement.store_name,
					phone_number: lastElement.phone_number,
					description: lastElement.store_desc,
					total_product: lastElement.totalProduct,
					sales: lastElement.sales
				};
			}
		}
		return objRes;
	},
	getSellerAdmin: function (id) {
		console.log(id);
		return new Promise((resolve, reject) => {
			db.query(getSellerQueryAdmin, (err, data) => {
				if (err) {
					console.log(err);
					reject({ msg: "No Seller found" });
				}
				// console.log("re", this.sellerAdminAlignHelper(data));
				resolve(this.sellerAdminAlignHelper(data));
			});
		});
	},
	addTransaction: function (body) {
		const { products, ...rest } = body;
		return new Promise((resolve, reject) => {
			const startTrans = "START TRANSACTION;";
			const firstQuery = "INSERT INTO transaction SET ?;";
			const lastQuery =
				"INSERT INTO trans_pvt (transaction_id, product_id, qty) VALUES ?;";
			const commitTrans = "COMMIT;";
			const allQuery = startTrans + firstQuery + lastQuery + commitTrans;
			let arrayOfOrder = products.map((product) => {
				return [body.id, product.id, product.qty];
			});
			db.query(allQuery, [rest, arrayOfOrder], (err, data) => {
				// console.log(arrayOfOrder);
				if (!err) {
					resolve(data);
				} else {
					reject(err);
				}
			});
		});
	},
	getTransactionCustomer: function (id) {
		return new Promise((resolve, reject) => {
			db.query(getTransQueryCustomer, [id], (err, data) => {
				if (err) {
					console.log(err);
					reject({ msg: "No Transaction found" });
				}
				//  console.log(this.alignHelper(data));
				resolve(this.alignHelper(data));
			});
		});
	},
	getTransactionSeller: function (id) {
		console.log(id);
		return new Promise((resolve, reject) => {
			db.query(getTransQuerySeller, [id], (err, data) => {
				if (err) {
					console.log(err);
					reject({ msg: "No Transaction found" });
				}
				 console.log(this.alignHelper(data));
				resolve(this.alignHelper(data));
			});
		});
	},
	getTransactionAdmin: function (id) {
		//console.log(id);
		return new Promise((resolve, reject) => {
			db.query(getTransQueryAdmin, [id], (err, data) => {
				if (err) {
					console.log(err);
					reject({ msg: "No Transaction found" });
				}
				console.log("trans", this.alignHelper(data));
				resolve(this.alignHelper(data));
			});
		});
	},

	
	addOrder: function (body) {
		const { invoice, customer_id, order_menu, amount } = body;
		return new Promise((resolve, reject) => {
			const startTrans = "START TRANSACTION;";
			const firstQuery =
				"INSERT INTO history SET invoice=?, customer_id=?, amount=?;";
			const lastQuery =
				"INSERT INTO menu_order_history (menu_id, invoice, quantity, user_id) VALUES ?;";
			const commitTrans = "COMMIT;";
			const allQuery = startTrans + firstQuery + lastQuery + commitTrans;
			let arrayOfOrder = order_menu.map((element) => {
				return [
					element.menu_id,
					invoice,
					element.quantity,
					customer_id,
				];
			});
			db.query(
				allQuery,
				[invoice, customer_id, amount, arrayOfOrder],
				(err, data) => {
					//   console.log(data);
					if (!err) {
						resolve(data);
					} else {
						reject(err);
					}
				}
			);
		});
	},
};

module.exports = transactionModel;
