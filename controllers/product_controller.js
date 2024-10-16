import { AppStrings } from "../constants/app.strings";
import { Product } from "../models/product.model";
import { BadRequestException, ServerApiError } from "../response/apiError.js";
import asyncHandler from "../response/asyncHandler";
import { ApiResponse } from "../response/response";
import { getCartItems } from "./cart_controller";

const setProduct = asyncHandler(async (req, res, next) => {
    const { product } = req.body;


    // Check if variants is an array
    if (!Array.isArray(product["variants"])) {
        throw new BadRequestException('Invalid input, expected an array of books')
    }

    const createdProduct = await Product.create(product)

    if (!createdProduct) {
        throw new ServerApiError(AppStrings.notAbleToCreateEntry);
    }

    if (createdProduct.variants.length != 0) {
        createdProduct.frequentVariant = createdProduct.variants[0]
        createdProduct.save();
    }

    res.status(200).send(new ApiResponse({ status: 200, message: "Success!", data: null }))
},)



const getProduct = asyncHandler(async (req, res, next) => {
    const id = req.query.id;

    const product = Product.findById(id);

    if (!product) {
        throw new BadRequestException(AppStrings.noItemFound);
    }
    res.status(200).send(new ApiResponse({ status: 200, message: "Success!", data: product }))

})


const getAllProduct = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.body.page) || 1;  // Default to page 1
    const limit = parseInt(req.body.limit) || 5;  // Default to 5 users per page

    const categoryId = req.body.categoryId;

    const startIndex = (page - 1) * limit;

    // Base query to fetch products
    let query = Product.find();

    // Apply category filter if `categoryId` is provided
    if (categoryId) {
        query = query.where({ category: categoryId });
    }

    // Populate related fields (category and variants)
    query = query
        .populate("category")
        .limit(limit)           // Limit the number of products per page
        .skip(startIndex);      // Skip to the correct page

    // Execute the query
    const products = await query.exec();
    if (!products) {
        res.status(200).send(new ApiResponse({ status: 200, message: "Success!", data: { "products": [], page: page, limit: limit } }))

    }
    res.status(200).send(new ApiResponse({ status: 200, message: "Success!", data: { "products": products, page: page + 1, limit: limit } }))
},)


const deleteProduct = asyncHandler(async (req, res, next) => {
    const productId = req.query.id;
    await Product.deleteOne({ _id: productId })

})

const updateProduct = asyncHandler(async (req, res, next) => {
    const { product } = req.body;

    // Check if variants is an array
    if (!Array.isArray(product["variants"])) {
        throw new BadRequestException('Invalid input, expected an array of books')
    }

    const updatedProduct = await Product.findOneAndreplace({ _id: product.id }, { product }, { upsert: false })

    if (!updatedProduct) {
        throw new ServerApiError(AppStrings.notAbleToCreateEntry);
    }



    res.status(200).send(new ApiResponse({ status: 200, message: "Success!", data: updatedProduct }))
},)

const removeCategory = asyncHandler(async (req, res, next) => {
    const { productId, variantId } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, {
        "$pull": { _id: variantId },
    },
        { upsert: false, new: false }

    );
    if (!updatedProduct) {
        throw new ServerApiError(AppStrings.notAbleToCreateEntry);

    }
    res.status(200).send(new ApiResponse({ status: 200, message: "Success!", data: null }))

});


export { setProduct, getAllProduct, getProduct, updateProduct, deleteProduct, removeCategory }