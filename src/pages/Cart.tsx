import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is currently empty.</p>
          <Link 
            to="/shop" 
            className="inline-block px-6 py-3 bg-emerald-700 text-white font-medium rounded-md hover:bg-emerald-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-8">Your Cart</h1>
      
      <div className="lg:flex gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-900">
                  Items ({cart.itemCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item.product.id} className="p-6">
                  <div className="flex items-center">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.product.name}
                          </h3>
                          
                          {/* Dosha Badges */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.product.doshaBalancing.includes('vata') && (
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                Vata
                              </span>
                            )}
                            {item.product.doshaBalancing.includes('pitta') && (
                              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                Pitta
                              </span>
                            )}
                            {item.product.doshaBalancing.includes('kapha') && (
                              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                Kapha
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-emerald-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800 flex items-center transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} className="mr-1" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              to="/shop" 
              className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                <span className="text-gray-900">Estimated Total</span>
                <span className="text-emerald-900">${cart.total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md transition-colors flex items-center justify-center"
            >
              Proceed to Checkout <ArrowRight size={18} className="ml-2" />
            </button>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Secure checkout powered by Stripe
            </div>
          </div>
          
          {/* Promotions */}
          <div className="mt-6 bg-amber-50 rounded-lg p-6 border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-3">Have a promo code?</h3>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Enter code" 
                className="flex-grow px-4 py-2 rounded-l-md border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-r-md transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;