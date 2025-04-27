import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ShoppingCart, Star } from 'lucide-react';
import { products, getProductsByCategory } from '../data/products';
import { Product, DohaType } from '../types';
import { useCart } from '../context/CartContext';

const Shop: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [doshaFilter, setDoshaFilter] = useState<DohaType | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let result = category ? getProductsByCategory(category as any) : products;
    
    // Apply dosha filter
    if (doshaFilter !== 'all') {
      result = result.filter(product => 
        product.doshaBalancing.includes(doshaFilter as any)
      );
    }
    
    // Apply price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [category, doshaFilter, priceRange]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const categoryDisplayName = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : 'All Products';

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2">{categoryDisplayName}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/shop" className={`px-3 py-1 rounded-full text-sm ${!category ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            All
          </Link>
          <Link to="/shop/herbs" className={`px-3 py-1 rounded-full text-sm ${category === 'herbs' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Herbs & Spices
          </Link>
          <Link to="/shop/oils" className={`px-3 py-1 rounded-full text-sm ${category === 'oils' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Essential Oils
          </Link>
          <Link to="/shop/teas" className={`px-3 py-1 rounded-full text-sm ${category === 'teas' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Herbal Teas
          </Link>
          <Link to="/shop/supplements" className={`px-3 py-1 rounded-full text-sm ${category === 'supplements' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Supplements
          </Link>
          <Link to="/shop/skincare" className={`px-3 py-1 rounded-full text-sm ${category === 'skincare' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Skincare
          </Link>
        </div>
      </div>

      <div className="lg:flex gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700"
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            {/* Dosha Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Dosha Balance</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dosha" 
                    checked={doshaFilter === 'all'} 
                    onChange={() => setDoshaFilter('all')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">All Doshas</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dosha" 
                    checked={doshaFilter === 'vata'} 
                    onChange={() => setDoshaFilter('vata')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vata</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dosha" 
                    checked={doshaFilter === 'pitta'} 
                    onChange={() => setDoshaFilter('pitta')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pitta</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dosha" 
                    checked={doshaFilter === 'kapha'} 
                    onChange={() => setDoshaFilter('kapha')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Kapha</span>
                </label>
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">${priceRange[0]}</span>
                  <span className="text-xs text-gray-500">${priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-emerald-100 rounded-md appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setDoshaFilter('all');
                  setPriceRange([0, 100]);
                }}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={(e) => handleAddToCart(product, e)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
          />
          {/* Dosha Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.doshaBalancing.includes('vata') && (
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">Vata</span>
            )}
            {product.doshaBalancing.includes('pitta') && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">Pitta</span>
            )}
            {product.doshaBalancing.includes('kapha') && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">Kapha</span>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center text-amber-500">
              <Star size={16} className="fill-current" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount} reviews)</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-900">${product.price.toFixed(2)}</span>
            <button
              onClick={onAddToCart}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Shop;