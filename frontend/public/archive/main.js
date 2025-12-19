(function (window, document, undefined) {
	'use strict';

	/*==============================
	Header
	==============================*/
	if (document.querySelector('.header')) {
		const headerBtn = document.querySelector('.header__btn');
		const headerNav = document.querySelector('.header__nav');
		const headerSrc = document.querySelector('.header__search');
		const headerSrcBtn = document.querySelector('.header__search-btn');
		const headerSrcCls = document.querySelector('.header__search-close');

		function toggleHeaderMenu() {
			headerBtn.classList.toggle('header__btn--active');
			headerNav.classList.toggle('header__nav--active');

			/* z-index fix */
			if (document.querySelector('.filter--fixed')) {
				var filterFixed = document.querySelector('.filter--fixed');
				filterFixed.classList.toggle('filter--hidden');
			}
		}
		headerBtn.addEventListener('click', toggleHeaderMenu);

		function toggleSearch() {
			headerSrc.classList.toggle('header__search--active');
		}
		headerSrcBtn.addEventListener('click', toggleSearch);
		headerSrcCls.addEventListener('click', toggleSearch);
	}

	/*==============================
	Filter
	==============================*/
	if (document.querySelector('.mfilter')) {
		var mfilterBtn = document.querySelector('.filter__menu');
		var mfilterClose = document.querySelector('.mfilter__close');
		var mfilter = document.querySelector('.mfilter');

		function toggleMfilter() {
			mfilter.classList.toggle('mfilter--active');
		}

		mfilterBtn.addEventListener('click', toggleMfilter);
		mfilterClose.addEventListener('click', toggleMfilter);
	}

	/* z-index fix */
	if (document.querySelector('.filter--fixed')  && window.innerWidth >= 1200 ) {
		const filterFixed = document.querySelector('.filter--fixed');

		filterFixed.classList.add('filter--hidden');

		window.addEventListener('scroll', function() {
			

			if (filterFixed && window.innerWidth >= 1200) {
				var distanceToTop = filterFixed.getBoundingClientRect().top;

				if (distanceToTop <= 80) {
					filterFixed.classList.remove('filter--hidden');
				} else {
					filterFixed.classList.add('filter--hidden');
				}
			}
		});
	}

	/*==============================
	Carousel
	==============================*/
	if (document.querySelector('.home__carousel')) {
		new Splide('.home__carousel', {
			type: 'loop',
			perPage: 5,
			drag: true,
			pagination: false,
			autoWidth: false,
			autoHeight: false,
			speed: 800,
			gap: 30,
			arrows: false,
			focus: 0,
			breakpoints: {
				575: {
					gap: 24,
					arrows: false,
					perPage: 2,
				},
				767: {
					gap: 24,
					arrows: false,
					perPage: 3,
				},
				991: {
					arrows: false,
					perPage: 3,
					gap: 24,
				},
				1199: {
					arrows: false,
					perPage: 4,
					gap: 24,
				},
				1399: {
					arrows: false,
					perPage: 5,
					gap: 24,
				},
			}
		}).mount();
	}

	if (document.querySelector('.hero')) {
		new Splide('.hero', {
			type: 'loop',
			perPage: 1,
			drag: true,
			pagination: true,
			speed: 1200,
			gap: 24,
			arrows: false,
			focus: 0,
		}).mount();
	}

	if (document.querySelector('.section__carousel')) {
		var elms = document.getElementsByClassName('section__carousel');

		for ( var i = 0; i < elms.length; i++ ) {
			new Splide(elms[ i ], {
				type: 'loop',
				perPage: 6,
				drag: true,
				pagination: false,
				autoWidth: false,
				autoHeight: false,
				speed: 800,
				gap: 24,
				arrows: false,
				focus: 0,
				breakpoints: {
					575: {
						arrows: false,
						perPage: 2,
					},
					767: {
						arrows: false,
						perPage: 3,
					},
					991: {
						arrows: false,
						perPage: 3,
					},
					1199: {
						arrows: false,
						perPage: 4,
					},
				}
			}).mount();
		}
	}

	if (document.querySelector('.section__roadmap')) {
		var elms = document.getElementsByClassName('section__roadmap');

		for ( var i = 0; i < elms.length; i++ ) {
			new Splide(elms[ i ], {
				type: 'loop',
				perPage: 3,
				drag: true,
				pagination: false,
				autoWidth: false,
				autoHeight: true,
				speed: 800,
				gap: 30,
				arrows: false,
				focus: 0,
				breakpoints: {
					767: {
						gap: 20,
						arrows: false,
						perPage: 1,
					},
					991: {
						arrows: false,
						perPage: 2,
					},
					1199: {
						arrows: false,
						perPage: 3,
					},
				}
			}).mount();
		}
	}

	/*==============================
	Section bg
	==============================*/
	if (document.querySelector('.section--bg')) {
		var mainBg = document.querySelector('.section--bg');

		if (mainBg.getAttribute('data-bg')) {
			mainBg.style.background = `url(${mainBg.getAttribute('data-bg')})`;
			mainBg.style.backgroundPosition = 'center center';
			mainBg.style.backgroundRepeat = 'no-repeat';
			mainBg.style.backgroundSize = 'cover';
		}
	}

	if (document.querySelector('.hero__slide')) {
		document.querySelectorAll('.hero__slide').forEach(function(element) {
			if (element.getAttribute("data-bg")) {
				element.style.background = 'url(' + element.getAttribute('data-bg') + ')';
				element.style.backgroundPosition = 'center center';
				element.style.backgroundRepeat = 'no-repeat';
				element.style.backgroundSize = 'cover';
			}
		});
	}

	if (document.querySelector('.section__details-bg')) {
		var mainBg = document.querySelector('.section__details-bg');

		if (mainBg.getAttribute('data-bg')) {
			mainBg.style.background = `url(${mainBg.getAttribute('data-bg')})`;
			mainBg.style.backgroundPosition = 'center center';
			mainBg.style.backgroundRepeat = 'no-repeat';
			mainBg.style.backgroundSize = 'cover';
		}
	}

	/*==============================
	Select
	==============================*/
	if (document.querySelector('#filter__genre')) {
		new SlimSelect({
			select: '#filter__genre'
		});
	}

	if (document.querySelector('#filter__quality')) {
		new SlimSelect({
			select: '#filter__quality',
			settings: {
				showSearch: false,
			}
		});
	}

	if (document.querySelector('#filter__rate')) {
		new SlimSelect({
			select: '#filter__rate',
			settings: {
				showSearch: false,
			}
		});
	}

	if (document.querySelector('#filter__sort')) {
		new SlimSelect({
			select: '#filter__sort',
			settings: {
				showSearch: false,
			}
		});
	}

	/* mobile filter */
	if (document.querySelector('#mfilter__genre')) {
		new SlimSelect({
			select: '#mfilter__genre'
		});
	}

	if (document.querySelector('#mfilter__quality')) {
		new SlimSelect({
{