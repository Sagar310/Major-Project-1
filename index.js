const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { initializeDatabase } = require("./db/db.connect");
const User = require("./models/user.models");
const Address = require("./models/address.models");
const Cart = require("./models/cart.models");
const Category = require("./models/category.models");
const Order = require("./models/order.models");
const OrderProduct = require("./models/orderProduct.models");
const Product = require("./models/product.models");
const Wishlist = require("./models/wishlist.models");

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
  
app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

async function createUser(newUser){
    try{
        const user = new User(newUser);
        const saveUser = await user.save();
        return saveUser;
    }
    catch(error){
        throw error;
    }
}

app.post("/user", async (req, res) => {
    try{
        const savedUser = await createUser(req.body)
        res.status(201).json({message: "User added successfully.", user: savedUser})
    }
    catch(error){
        res.status(500).json({error: "Failed to add user."})
    }
})

async function createAddress(newAddress){
    try{
        const address = new Address(newAddress);
        const saveAddress = await address.save();
        return saveAddress;
    }
    catch(error){
        throw error;
    }
}

app.post("/address", async (req, res) => {
    try{
        const savedAddress = await createAddress(req.body)
        res.status(201).json({message: "Address added successfully.", address: savedAddress})
    }
    catch(error){
        res.status(500).json({error: "Failed to add address."})
    }
})

async function readAllAddresses() {
    try{
        const addresses = await Address.find();        
        return addresses;
    }
    catch(error){
        throw error;
    }
}

app.get("/addresses", async (req, res) => {
    try {
        const addresses = await readAllAddresses();
        if(addresses.length > 0)
        {
            res.json(addresses);
        }
        else{
            res.status(404).json({error: "No addresses found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch addresses."});
    }
})

async function deleteAddress(addressId){
    try{        
        const deletedAddress = await Address.findByIdAndDelete(addressId);        
        return deletedAddress;
    }
    catch(error){
        console.log(error);
    }
}

app.delete("/address/:addressId", async (req,res) => {
    try{        
        const deletedAddress = await deleteAddress(req.params.addressId);        
        res.status(200).json({message: "Address deleted successfully."});
    }
    catch(error){
        res.status(500).json({error: "Failed to delete movie."});
    }
})

async function updateAddress(addressId, dataToUpdate) {
    try{
        const updatedAddress = await Address.findByIdAndUpdate(addressId, dataToUpdate, {
            new: true
        });
        return updatedAddress;
    }
    catch(error){
        console.log(error);
    }
}

app.post("/address/:addressId", async (req, res) => {
    try{
        const updatedAddress = await updateAddress(req.params.addressId, req.body);
        if(updatedAddress){
            res.status(200).json({message: "Address updated successfully."});
        }
        else{
            res.status(404).json({message: "Address not found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to update the address."});
    }
})

async function addCartItem(cartItem){    
    try{
        const cart = new Cart(cartItem);
        const saveCart = await cart.save();
        return saveCart;        
    }
    catch(error){        
        throw error;
    }
}

app.post("/cart", async (req, res) => {
    const { product, user, size, quantity } = req.body;
    try{        
        const existingItem = await Cart.findOne({ product, user, size });

        if (existingItem) 
        {        
            existingItem.quantity = existingItem.quantity + quantity > 10 ? 10 : existingItem.quantity + quantity;            
            const updatedCartItem = await updateCartItem(existingItem._id, existingItem);
            if(updatedCartItem)
            {
                res.status(200).json({message: "Cart item updated successfully.", updatedCartItem: updatedCartItem});
            }
            else
            {
                res.status(404).json({message: "Cart item not found."});
            }
        } 
        else 
        {
            const savedCart = await addCartItem(req.body)
            res.status(201).json({message: "Item added to cart successfully.", cart: savedCart})
        }      
    }
    catch(error){
        res.status(500).json({error: "Failed to add item in the cart."})
    }
})

async function updateCartItem(cartItemId, cartItem) {
    try{
        const updatedCartItem = await Cart.findByIdAndUpdate(cartItemId, cartItem, {
            new: true
        });
        return updatedCartItem;
    }
    catch(error){
        console.log(error);
    }
}

app.post("/cart/:cartItemId", async (req, res) => {
    try{
        const updatedCartItem = await updateCartItem(req.params.cartItemId, req.body);
        if(updatedCartItem){
            res.status(200).json({message: "Cart item updated successfully.", updatedCartItem: updatedCartItem});
        }
        else{
            res.status(404).json({message: "Cart item not found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to update cart item."});
    }
})

async function readCartItemsByUser(userId){
    try{
        const cartItems = await Cart.find({user: userId}).populate("product");                        ;
        return cartItems;
    }
    catch(error){
        throw error
    }
}

app.get("/cart/user/:userId", async (req, res) => {
    try{
        const cartItems = await readCartItemsByUser(req.params.userId);
        if(cartItems.length > 0){
            res.json(cartItems);
        }
        else{
            res.status(404).json({error: "No cart items found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch cart items."});
    }
})

async function deleteItemFromCart(cartItemId){
    try{        
        const deletedItem = await Cart.findByIdAndDelete(cartItemId);        
        return deletedItem;
    }
    catch(error){
        console.log(error);
    }
}

app.delete("/cart/:cartItemId", async (req,res) => {
    try{        
        const deletedItem = await deleteItemFromCart(req.params.cartItemId);        
        res.status(200).json({message: "Cart item deleted successfully."});
    }
    catch(error){
        res.status(500).json({error: "Failed to delete the item from the cart."});
    }
})

async function createCategory(newCategory){
    try{
        const category = new Category(newCategory);
        const saveCategory = await category.save();
        return saveCategory;
    }
    catch(error){
        throw error;
    }
}

app.post("/category", async (req, res) => {
    try{
        const savedCategory = await createCategory(req.body)
        res.status(201).json({message: "Category added successfully.", category: savedCategory})
    }
    catch(error){
        res.status(500).json({error: "Failed to add category."})
    }
})

async function createOrder(newOrder){
    try{
        const order = new Order(newOrder);
        const saveOrder = await order.save();
        return saveOrder;
    }
    catch(error){
        throw error;
    }
}

app.post("/order", async (req, res) => {
    try{
        const savedOrder = await createOrder(req.body)
        res.status(201).json({message: "Order added successfully.", order: savedOrder})
    }
    catch(error){
        res.status(500).json({error: "Failed to add order."})
    }
})

async function createOrderProduct(newOrderProduct){
    try{
        const orderProduct = new OrderProduct(newOrderProduct);
        const saveOrderProduct = await orderProduct.save();
        return saveOrderProduct;
    }
    catch(error){
        throw error;
    }
}

app.post("/order/product", async (req, res) => {
    try{
        const savedOrderProduct = await createOrderProduct(req.body)
        res.status(201).json({message: "Order product added successfully.", orderProduct: savedOrderProduct})
    }
    catch(error){
        res.status(500).json({error: "Failed to add order product."})
    }
})

async function createProduct(newProduct){
    try{
        const product = new Product(newProduct);
        const saveProduct = await product.save();
        return saveProduct;
    }
    catch(error){
        throw error;
    }
}

app.post("/product", async (req, res) => {
    try{
        const savedProduct = await createProduct(req.body)
        res.status(201).json({message: "Product added successfully.", product: savedProduct})
    }
    catch(error){
        res.status(500).json({error: "Failed to add product."})
    }
})

async function addItemToWishlist(item){
    try{
        const saveWishlistItem = new Wishlist(item);
        const savedWishlistItem = await saveWishlistItem.save();
        return savedWishlistItem;
    }
    catch(error){
        throw error;
    }
}

app.post("/wishlist", async (req, res) => {
    try{
        const savedWishlistItem = await addItemToWishlist(req.body)
        res.status(201).json({message: "Item added to the wishlist successfully.", item: savedWishlistItem})
    }
    catch(error){
        res.status(500).json({error: "Failed to add item to the wishlist."})
    }
})

async function deleteItemFromWishlist(product, user){
    try{        
        const deletedWishlistItem = await Wishlist.deleteOne({ product, user });
        return deletedWishlistItem;
    }
    catch(error){
        console.log(error);
    }
}

app.delete("/wishlist", async (req, res) => {
    const { product, user } = req.body;
    try{        
        const deletedWishlistItem = await deleteItemFromWishlist(product, user);        
        res.status(200).json({message: "Item deleted from the wishlist successfully."});
    }
    catch(error){
        res.status(500).json({error: "Failed to delete the item from the wishlist."});
    }
})

async function readAllWishlistedProducts() {
    try{        
        const wishlistedProducts = await Wishlist.find().populate("product");                        
        return wishlistedProducts;
    }
    catch(error){
        throw error;
    }
}

app.get("/wishlist", async (req, res) => {
    try {
        const wishlistedProducts = await readAllWishlistedProducts();
        if(wishlistedProducts.length > 0)
        {
            res.json(wishlistedProducts);
        }
        else{
            res.status(404).json({error: "No wishlisted products found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch the wishlisted products."});
    }
})

async function readAllProducts() {
    try{
        const products = await Product.find().populate("category");
        const wishlist = await Wishlist.find().populate("product");                
        productsWithWishlist = products.map((productItem) => {return {...productItem.toObject(), isWishlisted: (wishlist.some((obj) => obj.product._id.toString() === productItem._id.toString()))}});
        return productsWithWishlist;
    }
    catch(error){
        throw error;
    }
}

app.get("/products", async (req, res) => {
    try {
        const products = await readAllProducts();
        if(products.length > 0)
        {
            res.json(products);
        }
        else{
            res.status(404).json({error: "No products found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products."});
    }
})

async function readProductById(productId){
    try{
        const product = await Product.findOne({_id: productId}).populate("category");
        return product;
    }
    catch(error){
        throw error
    }
}

app.get("/products/:productId", async (req, res) => {
    try{
        const product = await readProductById(req.params.productId);
        if(product){
            res.json(product);
        }
        else{
            res.status(404).json({error: "Product not found."});
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to fetch product."});
    }
})

async function readAllCategories() {
    try{
        const categories = await Category.find()
        return categories;
    }
    catch(error){
        throw error;
    }
}

app.get("/categories", async (req, res) => {
    try {
        const categories = await readAllCategories();
        if(categories.length > 0)
        {
            res.json(categories);
        }
        else{
            res.status(404).json({error: "No categories found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch categories."});
    }
})

async function readAllFeaturedCategories() {
    try{
        const categories = await Category.find({isFeatured: true});
        return categories;
    }
    catch(error){
        throw error;
    }
}

app.get("/categories/featured", async (req, res) => {
    try {
        const categories = await readAllFeaturedCategories();
        if(categories.length > 0)
        {
            res.json(categories);
        }
        else{
            res.status(404).json({error: "No featured categories found."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch featured categories."});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});