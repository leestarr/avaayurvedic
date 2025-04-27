import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, Star, Check, Info } from 'lucide-react';
import { getProductById } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      setProduct(foundProduct);
      
      // Reset state when product changes
      setQuantity(1);
      setActiveTab('description');
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Product not found.</p>
        <Link to="/shop" className="inline-block mt-4 px-6 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to products
        </button>
      </div>

      <div className="lg:flex gap-8">
        {/* Product Image */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:w-1/2">
          {/* Dosha Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.doshaBalancing.includes('vata') && (
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                Vata
              </span>
            )}
            {product.doshaBalancing.includes('pitta') && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                Pitta
              </span>
            )}
            {product.doshaBalancing.includes('kapha') && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
                Kapha
              </span>
            )}
          </div>

          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={`${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                />
              ))}
              <span className="ml-2 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="ml-1 text-sm text-gray-500">({product.reviewCount} reviews)</span>
          </div>
          
          <div className="text-2xl font-bold text-emerald-900 mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-gray-700 mb-6">
            {product.description}
          </p>
          
          {/* Quantity and Add to Cart */}
          <div className="flex items-center mb-8">
            <div className="mr-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex-grow">
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`ml-3 p-3 rounded-md border ${
                isFavorite 
                  ? 'bg-amber-50 text-amber-500 border-amber-200' 
                  : 'bg-white text-gray-400 border-gray-200 hover:text-amber-500'
              } transition-colors duration-300`}
              aria-label="Add to favorites"
            >
              <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
          
          {/* In Stock Indicator */}
          <div className="flex items-center text-emerald-700 mb-6">
            <Check size={18} className="mr-1" />
            <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex -mb-px">
              <button
                className={`py-2 px-4 font-medium text-sm mr-6 border-b-2 ${
                  activeTab === 'description'
                    ? 'border-emerald-700 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Benefits
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm mr-6 border-b-2 ${
                  activeTab === 'ingredients'
                    ? 'border-emerald-700 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'usage'
                    ? 'border-emerald-700 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('usage')}
              >
                How to Use
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={18} className="mr-2 text-emerald-700 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-700 mr-2 mt-2 flex-shrink-0"></div>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-start p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <Info size={18} className="mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    All our ingredients are ethically sourced and free from synthetic additives, preservatives, 
                    and fillers. We prioritize organic and wildcrafted herbs whenever possible.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'usage' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">How to Use</h3>
                <p className="text-gray-700">{product.usage}</p>
                <div className="mt-4 flex items-start p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <Info size={18} className="mr-2 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800">
                    Consistency is key with Ayurvedic products. For best results, use as directed for at 
                    least 4-6 weeks. Individual results may vary.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6">You Might Also Like</h2>
        {/* This would typically show other products */}
      </div>
    </div>
  );
};

export default ProductDetail;