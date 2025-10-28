import { setCart } from "@/redux/slice/cartSideBarSlice";

export const getCart = async (dispatch) => {
  const myCart = localStorage.getItem("lalon-cart");
  if (myCart) {
    dispatch(setCart(JSON.parse(myCart)));
  }
};

export const addToCart = async (dispatch, product) => {
  const myCart = localStorage.getItem("lalon-cart");
  const cart = myCart ? JSON.parse(myCart) : {};

  const productKey = `${product.product}-${product.color}-${product.size}-${product.height}-${product.width}-${product.material}-${product.variant}`;

  if (cart[productKey]) {
    cart[productKey].quantity += product.quantity;
  } else {
    cart[productKey] = { ...product };
  }

  localStorage.setItem("lalon-cart", JSON.stringify(cart));
  dispatch(setCart(cart));
};

export const clearCart = async (dispatch) => {
  localStorage.removeItem("lalon-cart");
  dispatch(setCart({}));
}

export const removeFromCart = async (dispatch, id) => {
  const myCart = localStorage.getItem("lalon-cart");
  if (myCart) {
    const cart = JSON.parse(myCart);
    if (cart[id]) {
      delete cart[id];
    }
    localStorage.setItem("lalon-cart", JSON.stringify(cart));
    dispatch(setCart(cart));
  }
};

export const reduceQuantity = async (dispatch, id) => {
  const myCart = localStorage.getItem("lalon-cart");
  if (myCart) {
    const cart = JSON.parse(myCart);
    console.log(cart);

    if (cart[id]) {
      cart[id].quantity -= 1;
      localStorage.setItem("lalon-cart", JSON.stringify(cart));
      dispatch(setCart(cart));
    }
  }
};

export const increaseQuantity = async (dispatch, id) => {
  const myCart = localStorage.getItem("lalon-cart");
  if (myCart) {
    const cart = JSON.parse(myCart);

    if (cart[id]) {
      cart[id].quantity += 1;

      localStorage.setItem("lalon-cart", JSON.stringify(cart));
      dispatch(setCart(cart));
    }
  }
};

export const getAttribute = (pro) => {
  let item = { ...pro };
  delete item["product"];
  delete item["quantity"];
  delete item["id"];
  delete item["key"];
  delete item["name"];
  delete item["price"];
  delete item["image"];
  return Object.keys(item)
    .filter((key) => (item[key] ? true : false))
    .map((key) => `${key}: ${item[key]}`)
    .join(", ");
};
