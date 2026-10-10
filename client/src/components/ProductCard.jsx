import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatPrice } from '../utils';

const ProductCard = ({ product }) => {
  const { name, slug, price, priceOnRequest, category, primaryImage, images } = product;
  
  // Use primaryImage or the first image in the array
  const imageUrl = primaryImage || (images?.length > 0 ? images[0].url : '/placeholder.jpg');
  
  // For Cloudinary images, we can add simple transformations for the thumbnail
  // E.g., adding q_auto,f_auto,w_500,c_fill
  const optimizedImgUrl = imageUrl?.includes('cloudinary.com') 
    ? imageUrl.replace('/upload/', '/upload/w_500,c_fill,q_auto,f_auto/')
    : imageUrl;

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <Link to={`/products/${slug}`} className="relative aspect-[4/5] overflow-hidden bg-cream-50 block">
        <LazyLoadImage
          alt={name}
          src={optimizedImgUrl}
          effect="blur"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          wrapperClassName="w-full h-full"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-maroon-700 text-white text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded-sm shadow-sm">
              New
            </span>
          )}
          {product.stockStatus === 'made-to-order' && (
            <span className="bg-gold-600 text-white text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded-sm shadow-sm">
              Made to Order
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {category && (
          <span className="text-[10px] text-gray-warm uppercase tracking-widest mb-1">
            {category.name}
          </span>
        )}
        <Link to={`/products/${slug}`}>
          <h3 className="font-heading text-lg text-dark mb-2 line-clamp-2 group-hover:text-gold-700 transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-auto pt-3">
          <p className="font-body font-medium text-dark-light">
            {formatPrice(price, priceOnRequest)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-[4/5] skeleton w-full"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-3 skeleton w-1/3 mb-2 rounded"></div>
        <div className="h-5 skeleton w-full mb-1 rounded"></div>
        <div className="h-5 skeleton w-2/3 mb-3 rounded"></div>
        <div className="mt-auto pt-3">
          <div className="h-4 skeleton w-1/2 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
