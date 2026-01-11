const productRepository = require('../../data/repositories/productRepository');
const productValidator = require('../validators/productValidator');

class ProductService {
    
    async getAllProducts(category = null) {
        if (category) {
            productValidator.validateCategory(category);
        }
        const products = await productRepository.findAll(category);
        
        const totalValue = products.reduce((sum, p) => {
            return sum + (p.price * p.stock);
        }, 0);
        
        return {
            products: products,
            statistics: {
                count: products.length,
                totalValue: parseFloat(totalValue.toFixed(2))
            }
        };
    }
    
    async getProductById(id) {
        const validId = productValidator.validateId(id);
        const product = await productRepository.findById(validId);
        if (!product) throw new Error('Product not found');
        return product;
    }
    
    async createProduct(productData) {
        productValidator.validateProductData(productData);
        productValidator.validatePrice(productData.price);
        productValidator.validateCategory(productData.category);
        if (productData.stock !== undefined) {
            productValidator.validateStock(productData.stock);
        }
        return await productRepository.create(productData);
    }
    
    async updateProduct(id, productData) {
        const validId = productValidator.validateId(id);
        const existingProduct = await productRepository.findById(validId);
        if (!existingProduct) throw new Error('Product not found');
        
        productValidator.validateProductData(productData);
        productValidator.validatePrice(productData.price);
        productValidator.validateCategory(productData.category);
        productValidator.validateStock(productData.stock);
        
        return await productRepository.update(validId, productData);
    }
    
    async deleteProduct(id) {
        const validId = productValidator.validateId(id);
        const product = await productRepository.findById(validId);
        if (!product) throw new Error('Product not found');
        if (product.stock > 0) {
            throw new Error('Cannot delete product with stock > 0. Please reduce stock first.');
        }
        await productRepository.delete(validId);
        return { message: 'Product deleted successfully' };
    }
}

module.exports = new ProductService();
