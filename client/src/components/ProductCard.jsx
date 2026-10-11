import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatPrice } from '../utils';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const ProductCard = ({ product }) => {
  const { name, slug, price, priceOnRequest, category, primaryImage, images } = product;
  
  // Use primaryImage or the first image in the array
  const rawImageUrl = primaryImage || (images?.length > 0 ? images[0].url : '/placeholder.jpg');
  const optimizedImgUrl = optimizeCloudinaryUrl(rawImageUrl, { width: 600, height: 750, crop: 'fill' });

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-white border border-[#E5E5E5] transition-all duration-300 hover:border-[#111111]">
      {/* Image Container */}
      <Link to={`/products/${slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7] block">
        <LazyLoadImage
          alt={name}
          src={optimizedImgUrl}
          effect="blur"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          wrapperClassName="w-full h-full"
        />
        
        {/* Minimal Luxury Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-[#111111] text-white text-[9px] uppercase font-medium tracking-[0.2em] py-1 px-2.5 shadow-sm">
              New
            </span>
          )}
          {product.stockStatus === 'made-to-order' && (
            <span className="bg-white text-[#111111] border border-[#E5E5E5] text-[9px] uppercase font-medium tracking-[0.2em] py-1 px-2.5">
              Made to Order
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {category && (
          <span className="text-[10px] text-[#6B6B6B] uppercase tracking-[0.22em] mb-1.5">
            {category.name}
          </span>
        )}
        <Link to={`/products/${slug}`} className="mb-3">
          <h3 className="font-heading text-base md:text-lg text-[#111111] font-normal leading-snug line-clamp-2 transition-opacity group-hover:opacity-60">
            {name}
          </h3>
        </Link>
        <div className="mt-auto pt-2 border-t border-[#F2F2F2]">
          <p className="font-body text-xs md:text-sm font-medium tracking-wider text-[#111111]">
            {formatPrice(price, priceOnRequest)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white border border-[#E5E5E5]">
      <div className="aspect-[4/5] skeleton w-full"></div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-3 skeleton w-1/3 mb-3"></div>
        <div className="h-4 skeleton w-full mb-2"></div>
        <div className="h-4 skeleton w-2/3 mb-4"></div>
        <div className="mt-auto pt-2">
          <div className="h-4 skeleton w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
