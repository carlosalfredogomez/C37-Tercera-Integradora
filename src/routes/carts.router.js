import { Router } from 'express'
import CartsController from '../controllers/carts.controller.js'

const router = Router()


router.get('/', CartsController.getAll)

router.get('/:cid', CartsController.getCartById)

router.post('/', CartsController.createCart)

router.post('/:cid/products/:pid', CartsController.addToCart)

router.put('/:cid/products/:pid', CartsController.updateQuantity)

router.put('/:cid', CartsController.replaceProducts)

router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart)

router.delete('/:cid', CartsController.emptyCart)


export default router