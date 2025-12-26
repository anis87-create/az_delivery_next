'use client'
import Image from "next/image";
import sliderImg from '../public/images/slider_img.avif';
import { useEffect, useState } from "react";
import { useAppSelector } from "./hooks";
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Category from "./components/layouts/Category.jsx";
import RestaurantCard from "./components/RestaurantCard.jsx";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const {isLoading , user} = useSelector(state => state.auth);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(()=> {
    if (!isMounted) return;

    // Check if user is authenticated
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      // No user/token found - allow access to home page for non-authenticated users
      return;
    }

    if (user && user.role==='restaurant_owner') {
      router.push('/restaurantDashboard');
    }
  }, [user, isMounted, router]);
  const categories = [
  {
      name:'Pizza',
      icone: 'pizza',
      img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGl6emF8ZW58MHx8MHx8fDA%3D'
  },
  {
    name:'Burger',
    icone: 'burger',
    img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnVyZ2VyfGVufDB8fDB8fHww'
  },
  {
      name:'Sushi',
      icone: 'sushi',
      img:'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&amp;h=200&amp;fit=crop&amp;crop=center"'
  },
  {
    name: 'Salads',
    icone: 'salad',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&amp;h=200&amp;fit=crop&amp;crop=center'
  },
  {
    name:'Desserts',
    icone: 'dessert',
    img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&amp;h=200&amp;fit=crop&amp;crop=center'
  },
  {
    name:'Mexican',
    icone: 'mexican',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&amp;h=200&amp;fit=crop&amp;crop=center'
  },
  {
    name:'Indian',
    icone: 'indian',
    img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&amp;h=200&amp;fit=crop&amp;crop=center'
  },
  {
    name:'Chinese',
    icone: 'chinese',
    img:'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=300&amp;h=200&amp;fit=crop&amp;crop=center'
  },
  {
    name:'Healthy',
    icone: 'healthy',
    img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhbHRoeXxlbnwwfHwwfHx8MA%3D%3D'
  }
  ];

  const sliderImages = [
    {
      id: 1,
      img: sliderImg,
      title: "50% OFF Your First order",
      subtitle: "Use code: welcome50",
      buttonText: "Order Now"
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      title: "Free Delivery Weekend",
      subtitle: "No minimum order required",
      buttonText: "Explore Menu"
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      title: "Fresh Pizza Daily",
      subtitle: "Made with premium ingredients",
      buttonText: "Order Pizza"
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      title: "Burger Combo Deal",
      subtitle: "Buy 1 Get 1 at 50% OFF",
      buttonText: "Get Deal"
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
 // const {favorites} = useAppSelector(state => state.favorites);
  const { user } = useAppSelector(state => state.auth);
  const {restaurants } = useAppSelector(state => state.restaurant);
 //const { orders } = useAppSelector(state => state.order);
  // Optimize favorites lookup with Set for O(1) performance
 /* const favoriteIds = useMemo(() => {
    return new Set(favorites.map((fav:any) => fav.id));
  }, [favorites]);*/

  // Ensure currentSlide is always valid
  const safeCurrentSlide = currentSlide >= 0 && currentSlide < sliderImages.length ? currentSlide : 0;
  const currentSlideData = sliderImages[safeCurrentSlide] || sliderImages[0];

  const nextSlide = () => {
    if (sliderImages.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }
  };

  const prevSlide = () => {
    if (sliderImages.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    }
  };

  if(isLoading){
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <main className='mt-32.5 flex-1'>
       <section className='mt-5 mb-[60px] my-8 mx-0 md:my-12 md:mx-0 lg:my-16 lg:mx-0'>
            <div className='container mx-auto w-[90%]'>
            <div className='flex flex-col lg:flex-row relative'>
               {/**slider content description */}
               <div className='flex flex-1   h-auto border-transparent border-0 lg:flex-row'>
                  <div className='flex-1 h-full bg-linear-to-r from-[#22C55E] to-[#15803D] border-0 rounded-tl-[15px] rounded-tr-[15px] text-center py-[10px] text-white flex flex-col justify-center items-center leading-normal md:text-center md:items-center md:pl-10 md:rounded-tl-[15px] md:rounded-tr-[15px] md:rounded-bl-none md:rounded-br-none md:leading-relaxed lg:text-left lg:items-start lg:rounded-tl-lg lg:rounded-bl-lg lg:rounded-tr-none '> 
                    <h3 className='text-xl lg:text-2rem mb-2 sm:mb-4'>{currentSlideData.title}</h3>
                    <span className='mb-4 sm:mb-6 sm:text-base md:text-lg opacity-90 line-clamp-2 sm:line-clamp-none'>{currentSlideData.subtitle}</span>
                    <button className='ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 bg-white text-black hover:bg-gray-100 font-medium px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base'>{currentSlideData.buttonText}</button> 
                  </div>
               </div>
               {/**slider content img */}
               <div className='flex-1 relative md:static md:flex-1'>
                 {currentSlideData.img && (
                   <Image src={currentSlideData.img} alt="slider" width={800} height={400} className='w-full h-full object-cover rounded-b-xl lg:rounded-bl-none lg:rounded-br-[15px] lg:rounded-tr-[15px] transition-all duration-500'/>
                 )}
                 {/** slider opacity */}
                 <div className='absolute w-full h-full top-0 left-0 lg:mt-[70px]'>
                    <div className='w-11/12 flex justify-between mt-10 mx-auto md:mt-[120px] md:mx-auto md:mb-0 lg:w-[97%]'>
                        <button 
                          onClick={prevSlide}
                          className='bg-white w-10 h-10 rounded-full text-black cursor-pointer flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 hover:shadow-xl transition-all duration-300'
                        >
                          <HiChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={nextSlide}
                          className='bg-white w-10 h-10 rounded-full text-black cursor-pointer flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 hover:shadow-xl transition-all duration-300'
                        >
                          <HiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Slide Indicators */}
                    <div className='flex justify-center mt-4 space-x-2'>
                      {sliderImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === safeCurrentSlide 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                </div>
               </div>
            </div>
           </div> 
       </section>
     {/**categories section */}
     <div className='container mx-auto w-[90%] my-8 md:my-12 lg:my-16'>  
        <div className="mb-6">
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-gray-800'>What are you Craving?</h2> 
          <p className="text-gray-600 text-sm sm:text-base">Discover delicious food from various cuisines</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {
            categories.map((category, index) => {
               return ( <Category
                key={index}
                name={category.name}
                icon={category.icone}
                img={category.img}
              />)
            })
          }
        </div>
     </div>

     {/*🔥 Trending section 
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-[4rem] lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <div>
               <h2 className='text-xl sm:text-2xl font-bold flex items-center gap-2'>
                 🔥 Trending
               </h2>
               <p className="text-gray-600 text-sm mt-1">Most popular dishes right now</p>
             </div>
             <button
               onClick={() => navigate('/search?category=trending')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-4 gap-4 md:grid-cols-2 md:gap-4'>
            {trendingDishes.map(dish => 
              <PopularDish 
                key={dish.id}
                dish={dish}
              />
            )}
           </div>
       </div>
     </div> */}

     {/*💰 Special Offers section 
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-[4rem] lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <div>
               <h2 className='text-xl sm:text-2xl font-bold flex items-center gap-2'>
                 💰 Special Offers
               </h2>
               <p className="text-gray-600 text-sm mt-1">Save on your favorite dishes</p>
             </div>
             <button
               onClick={() => navigate('/search?category=offers')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-3 gap-4 md:grid-cols-2 md:gap-4'>
            {specialOffers.map(offer => 
              <SpecialOffer 
                key={offer.id}
                offer={offer}
              />
            )}
           </div>
       </div>
     </div> */}

     {/*⭐ Top Rated section 
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-[4rem] lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <div>
               <h2 className='text-xl sm:text-2xl font-bold flex items-center gap-2'>
                 ⭐ Top Rated
               </h2>
               <p className="text-gray-600 text-sm mt-1">Highest rated restaurants by our customers</p>
             </div>
             <button
               onClick={() => navigate('/search?category=top-rated')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-3 gap-4 md:grid-cols-2 md:gap-4'>
            {topRatedRestaurants.map(restaurant =>
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                img={restaurant.img}
                name={restaurant.name}
                rate={restaurant.rate}
                time={restaurant.time}
                tags={restaurant.tags}
                badge={restaurant.badge}
                userId= {user?._id}
                isActive ={ favoriteIds.has(restaurant.id) }
              />
            )}
           </div>
       </div>
     </div> */}

     {/*🚀 New Arrivals section 
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-[4rem] lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <div>
               <h2 className='text-xl sm:text-2xl font-bold flex items-center gap-2'>
                 🚀 New Arrivals
               </h2>
               <p className="text-gray-600 text-sm mt-1">Discover our newest restaurant partners</p>
             </div>
             <button
               onClick={() => navigate('/search?category=new')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-3 gap-4 md:grid-cols-2 md:gap-4'>
            {newRestaurants.map(restaurant =>
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                img={restaurant.img}
                name={restaurant.name}
                rate={restaurant.rate}
                time={restaurant.time}
                tags={restaurant.tags}
                badge={restaurant.badge}
                isNew={restaurant.isNew}
                userId= {user?._id}
                isActive ={ favoriteIds.has(restaurant.id) }
              />
            )}
           </div>
       </div>
     </div> */}

     {/*🎯 Recommended For You section 
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-[4rem] lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <div>
               <h2 className='text-xl sm:text-2xl font-bold flex items-center gap-2'>
                 🎯 Recommended For You
               </h2>
               <p className="text-gray-600 text-sm mt-1">Personalized selection based on your taste</p>
             </div>
             <button
               onClick={() => navigate('/search?category=recommended')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-3 gap-4 md:grid-cols-2 md:gap-4'>
            {recommendedForYou.map(restaurant =>
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                img={restaurant.img}
                name={restaurant.name}
                rate={restaurant.rate}
                time={restaurant.time}
                tags={restaurant.tags}
                reason={restaurant.reason}
                userId= {user?._id}
                isActive ={ favoriteIds.has(restaurant.id) }
              />
            )}
           </div>
       </div>
     </div> */}

     {/**cafes and bars section */}
     <>
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-16 lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <h2 className='text-xl sm:text-2xl font-bold'>Quick Bites</h2>
             <button
               onClick={() => router.push('/search?category=quick-bites')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-3 gap-4 md:grid-cols-2 md:gap-4'>
            {restaurants.filter((place) => place.type === 'quick_bite').slice(0, 3).map((place) =>
              <RestaurantCard
                key={place.id}
                id={place.id}
                img={place.coverImg}
                name={place.name}
                rate={place.rate}
                time={'10-30'}
                tags={place.tags}
                userId= {user?._id}
                isActive ={ false}
              />
            )}
           </div>
       </div>
     </div>
     </>

     {/**restaurants section */}
     <>
     <div className='container mx-auto w-[90%]'> 
       <div className='flex flex-col my-8 mx-0 md:my-12 md:mx-0 lg:my-16 lg:mx-0'>
           <div className="flex justify-between items-center mb-4 sm:mb-6">
             <h2 className='text-xl sm:text-2xl font-bold'>Featured Restaurants</h2>
             <button
               onClick={() => router.push('/search?category=restaurants')}
               className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base transition-colors duration-200"
             >
               View All
             </button>
           </div>
           <div className='grid lg:grid-cols-3 gap-4 md:grid-cols-2 md:gap-4'>
            {restaurants.filter((restaurant) => restaurant.type === 'restaurant').slice(0, 6).map((restaurant) =>
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                img={restaurant.coverImg}
                name={restaurant.name}
                rate={restaurant.rate}
                time={'10-30'}
                tags={restaurant.tags}
                userId= {user?._id}
                isActive ={ false }
              />
            )}
           </div>
       </div>
     </div>
     </>  

    </main>
  );
}
