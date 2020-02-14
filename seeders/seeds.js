var db = require("../Models");

let users = [
  {
    user_name: "Arman_user",
    password: "password",
    first_name: "Arman",
    last_name: "Riahi"
  },
  {
    user_name: "Chris_user",
    password: "password",
    first_name: "Chris",
    last_name: "Melby"
  },
  {
    user_name: "JDawg",
    password: "password",
    first_name: "Jerome",
    last_name: "Chenette"
  }
];

function userGenerate(users) {
  for (var i = 0; i < users.length; i++) {
    db.User.create(users[i]);
  }
}

userGenerate(users);

let receipts = [
  {
    label: "Sun",
    tax: 6.11,
    tip: 5.2,
    subtotal: 4.2,
    total: 10,
    UserId: 1
  },
  {
    label: "mooon",
    tax: 6,
    tip: 5,
    subtotal: 4,
    total: 10,
    UserId: 2
  },
  {
    label: "cow",
    tax: 6,
    tip: 5,
    subtotal: 4,
    total: 10,
    UserId: 1
  }
];

function ReceiptGenerate(receipts) {
  for (var i = 0; i < receipts.length; i++) {
    db.Receipt.create(receipts[i]);
  }
}

ReceiptGenerate(receipts);

let payers = [
  { name: "randomfacts", ReceiptId: 2 },
  { name: "jokes", ReceiptId: 3 },
  { name: "planes" }
];

function PayerGenerate(payers) {
  for (var i = 0; i < payers.length; i++) {
    db.Payer.create(payers[i]);
  }
}

PayerGenerate(payers);

let items = [
  { name: "cheetos", price: 20, ReceiptId: 2 },
  { name: "burger", price: 10, ReceiptId: 3 },
  { name: "pork", price: 20, ReceiptId: 4 }
];

function ItemGenerate(items) {
  for (var i = 0; i < items.length; i++) {
    db.Item.create(items[i]);
  }
}

ItemGenerate(items);
