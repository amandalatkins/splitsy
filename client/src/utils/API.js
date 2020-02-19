import axios from "axios";

export default {
  // Gets all Users
  getUsers: function() {
    return axios.get("/api/users");
  },
  // Log User In
  logInUser: function(info) {
    return axios.post("/api/users/login", info);
  },
  // Create user
  createUser: function(postData) {
    return axios.post("/api/users", postData);
  },
  // Gets all receipt for a user
  getReceiptsForUser: function(userId) {
    return axios.get("/api/receipts/userId/" + userId);
  },
  // get receipt by id
  getReceiptById: function(id) {
    return axios.get("/api/receipts/id/" + id);
  },
  // Create receipt
  createReceipt: function(postData) {
    return axios.post("/api/receipts", postData);
  },
  // Update receipt
  updateReceipt: function(id, postData) {
    return axios.put("/api/receipts/" + id, postData);
  },
  // Delete receipt
  deleteReceipt: function(id) {
    return axios.delete("/api/receipts/" + id);
  },
  // Create item
  createItem: function(postData) {
    return axios.post("/api/items", postData);
  },
  // Delete item
  deleteItem: function(id) {
    return axios.delete("/api/items/" + id);
  },
  updateItem: function(id, postData) {
    return axios.put("/api/items/" + id, postData);
  },
  // Create payer
  createPayer: function(postData) {
    return axios.post("/api/payers", postData);
  },
  // Delete payer
  deletePayer: function(id) {
    return axios.delete("/api/payers/" + id);
  },
  // add item to payer
  addItemToPayer: function(payerId, itemId) {
    return axios.put("/api/payers/" + payerId + "/add/item/" + itemId);
  },
  // remove item from payer
  removeItemToPayer: function(payerId, itemId) {
    return axios.put("/api/payers/" + payerId + "/remove/item/" + itemId);
  },
  getItemById: function(itemId) {
    return axios.get("/api/items/id/" + itemId);
  },
  getPayerById: function(payerId) {
    return axios.get("/api/payers/id/" + payerId);
  },
  updatePayer: function(payerId, body) {
    return axios.put("/api/payers/" + payerId, body);
  }
};
