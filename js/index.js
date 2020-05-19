var request = window.indexedDB.open("demo", 2);
var db;
var objectStore;
var dataList = [];
var products = [
  {
    id: 1,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-1.jpg",
  },
  {
    id: 2,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-2.jpg",
  },
  {
    id: 3,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-3.jpg",
  },
  {
    id: 4,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-4.jpg",
  },
  {
    id: 5,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-5.jpg",
  },
  {
    id: 6,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-6.jpg",
  },
  {
    id: 7,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-7.jpg",
  },
  {
    id: 8,
    title: "Crab Pool Security",
    price: "$30.00",
    img: "img/featured/feature-8.jpg",
  },
];
var nProduct = JSON.parse(localStorage.getItem("new"));
var delItem = JSON.parse(localStorage.getItem("delete"));
var editItem = JSON.parse(localStorage.getItem("edit"));

function edit(index) {
  localStorage.setItem("edit", JSON.stringify(dataList[index]));
  window.location.href = "./edit-product.html";
}

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("products")) {
    objectStore = db.createObjectStore("products", { keyPath: "id" });
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("img", "img", { unique: false });
    objectStore.createIndex("price", "price", { unique: false });

    objectStore.transaction.oncomplete = function (event) {
      var productsObjectStore = db
        .transaction("products", "readwrite")
        .objectStore("products");
      $.each(products, function (index, data) {
        productsObjectStore.add(data);
      });
    };
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (nProduct) {
    add(nProduct);
    console.log("new", nProduct);
    localStorage.removeItem("new");
  }

  if (delItem && delItem.id) {
    remove(delItem && delItem.id);
    localStorage.removeItem("delete");
  }

  if (editItem) {
    update(editItem);
    localStorage.removeItem("edit");
  }
  getAllData();
};

function add(product) {
  var request = db
    .transaction("products", "readwrite")
    .objectStore("products")
    .add({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
    });

  request.success = function (event) {
    console.log("数据写入成功");
  };

  request.onerror = function (event) {
    console.log("数据写入失败", event);
  };
}

function getAllData() {
  readAll().then(function (res) {
    let list = !!res ? dataList : products;
    console.log("list", list);
    $.each(list, function (index, data) {
      if (data && editItem && editItem.id === data.id) {
        data = editItem;
      }

      if (!!data) {
        var div =
          '<div class="col-lg-3 col-md-4 col-sm-6">' +
          '<div class="featured__item">' +
          '<div class="featured__item__pic set-bg" style="background:url(' +
          data.img +
          ')" >' +
          '<ul class="featured__item__pic__hover">' +
          ' <li><a href="#"><i class="fa fa-heart"></i></a></li>' +
          '<li><a href="#"><i class="fa fa-retweet"></i></a></li>' +
          ' <li><a href="#"><i class="fa fa-shopping-cart"></i></a></li>' +
          " </ul>" +
          "</div>" +
          '<div class="featured__item__text" onclick=edit(' +
          index +
          ")>" +
          '<h6><a href="##">' +
          data.title +
          "</a></h6>" +
          "<h5>" +
          data.price +
          "</h5>" +
          "</div>" +
          "</div>" +
          "</div>";

        $(div).appendTo($("#product_list"));
      }
    });
  });
}

function readAll() {
  objectStore = db.transaction("products").objectStore("products");
  return new Promise(function (resolve, reject) {
    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        dataList.push(cursor.value);
        cursor.continue();
      } else {
        resolve(true);
      }
    };
  });
}

function update(product) {
  var request = db
    .transaction("products", "readwrite")
    .objectStore("products")
    .put({
      id: product.id,
      title: product.title,
      img: product.img,
      price: product.price,
    });
  request.onsuccess = function (event) {
    console.log("数据更新成功");
  };
  request.onerror = function (event) {
    console.log("数据更新失败");
  };
}

function remove(id) {
  var request = db
    .transaction("products", "readwrite")
    .objectStore("products")
    .delete(id);

  request.onsuccess = function (event) {
    console.log("数据删除成功");
  };
}
