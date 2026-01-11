const express = require('express');
const router = express.Router();
// ระวัง! บรรทัดนี้ต้องมีไฟล์ controller อยู่จริงด้วยนะครับ
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;