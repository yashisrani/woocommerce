/**
 * External dependencies
 */
import { store, getContext, getElement } from '@woocommerce/interactivity';

/**
 * Internal dependencies
 */
import { ProductFiltersContext } from '../../frontend';

export type PriceFilterContext = {
	minPrice: number;
	maxPrice: number;
	minRange: number;
	maxRange: number;
};

store( 'woocommerce/product-filter-price', {
	actions: {
		setPrices: () => {
			const prices: Record< string, string > = {};
			const { ref } = getElement();
			const targetMinPriceAttribute =
				ref.getAttribute( 'data-target-min-price' ) ?? 'data-min-price';
			const targetMaxPriceAttribute =
				ref.getAttribute( 'data-target-max-price' ) ?? 'data-max-price';

			const minPrice = ref.getAttribute( targetMinPriceAttribute );
			if ( minPrice ) {
				prices.minPrice = minPrice;
			}

			const maxPrice = ref.getAttribute( targetMaxPriceAttribute );
			if ( maxPrice ) {
				prices.maxPrice = maxPrice;
			}

			const context = getContext< PriceFilterContext >();
			Object.assign( context, prices );
		},
		clearFilters: () => {
			const context = getContext< PriceFilterContext >();
			Object.assign( context, {
				minPrice: context.minRange,
				maxPrice: context.maxRange,
			} );
		},
	},
	callbacks: {
		updatePriceContext: () => {
			const context = getContext< PriceFilterContext >();
			const productFiltersContext = getContext< ProductFiltersContext >(
				'woocommerce/product-filters'
			);
			const validatedPrices: Record< string, string > = {};
			const params = { ...productFiltersContext.params };

			if (
				Number( context.minPrice ) > context.minRange &&
				Number( context.minPrice ) < context.maxRange
			) {
				validatedPrices.min_price = context.minPrice.toString();
			} else {
				delete params.min_price;
			}

			if (
				Number( context.maxPrice ) > context.minRange &&
				Number( context.maxPrice ) < context.maxRange
			) {
				validatedPrices.max_price = context.maxPrice.toString();
			} else {
				delete params.max_price;
			}

			productFiltersContext.params = {
				...params,
				...validatedPrices,
			};
		},
	},
} );
