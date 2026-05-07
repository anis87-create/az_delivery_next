'use client'
import Image from 'next/image';
import { FaPaperPlane, FaStar, FaArrowLeft } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import QuantityContainer from '../../components/QuantityContainer';
import moment from 'moment';
import { RootState } from '../../store/store';
import { Item } from '@/app/types/item.types';
import { useGetOneRestaurantQuery } from '@/app/store/services/restaurant';
import { useGetAllCategoriesQuery } from '@/app/store/services/category';
import { useGetCartItemQuery } from '@/app/store/services/cartItems';

type DayHours = { open: string; close: string; closed: boolean };
type OpeningHours = Record<string, DayHours>;

const RestaurantPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [commentContent, setCommentContent] = useState('');
  const [rateCount, setRateCount] = useState(0);
  const [commentsFiltredByRestaurant] = useState<unknown[]>([]);

  // RTK Query — remplace les 3 dispatches de l'ancien useEffect
  const { data: restaurant, isLoading } = useGetOneRestaurantQuery(id, { skip: !id });
  const { data: categories = [] } = useGetAllCategoriesQuery(id, { skip: !id });
  useGetCartItemQuery(); // Initialise le cache du panier

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant non trouvé</h2>
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const groupedItems: Record<string, Item[]> = restaurant?.items
    ?.filter((item) => id === item.restaurantId && item.isAvailable === true)
    .reduce<Record<string, Item[]>>((acc, item) => {
      if (!acc[item.categoryId]) {
        acc[item.categoryId] = [];
      }
      acc[item.categoryId].push(item);
      return acc;
    }, {});

  const findCategoryById = (categoryId: string): string | undefined =>
    categories?.find((category) => category._id === categoryId)?.name;

  const reply = (_comment: unknown): void => {
    setCommentContent('');
    setRateCount(0);
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setCommentContent(e.target.value);
  };

  const displayOpenHours = (openHours: OpeningHours): string => {
    const currentDay = moment().format('dddd').toLowerCase();
    const result = Object.entries(openHours).find(([day]) => day === currentDay);
    return `${result![1].open}-${result![1].close}`;
  };

  const displayOpenHoursStatus = (openHours: OpeningHours): 'opened' | 'closed' => {
    const currentDay = moment().format('dddd').toLowerCase();
    const result = Object.entries(openHours).find(([day]) => day === currentDay);
    return result![1].closed ? 'closed' : 'opened';
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-32.5">
      {/* Header */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={restaurant?.restaurant.coverImg ?? ''}
          alt={restaurant?.restaurant.name}
          className="w-full h-full object-cover"
          width={1200} height={400}
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <Link
          href="/"
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
        >
          <FaArrowLeft className="text-gray-800" />
        </Link>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant?.restaurant.name}</h1>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">—</span>
            </div>
            <div className="flex items-center gap-1">
              <MdAccessTime />
              <span>{restaurant?.restaurant.estimatedDeliveryTime || '10-30 min'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className={`inline-flex items-center gap-1 rounded-full border border-white px-2.5 py-0.5 text-xs font-semibold ${
              !restaurant?.restaurant?.baseFee ? 'bg-green-500 text-white' : ''
            }`}>
              <span>{!restaurant?.restaurant?.baseFee ? 'free delivery' : `${restaurant?.restaurant?.baseFee} TND`}</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-white px-2.5 py-0.5 text-xs font-semibold">
              <MdAccessTime />
              <span>{displayOpenHours(restaurant?.restaurant?.openingHours)}</span>
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              displayOpenHoursStatus(restaurant?.restaurant?.openingHours) === 'opened'
                ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {displayOpenHoursStatus(restaurant?.restaurant?.openingHours)}
            </span>
          </div>
          <div className="flex gap-2 mb-3">
            {restaurant?.restaurant.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4 text-sm">
            <span className="bg-orange-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
              Delivery: {restaurant?.restaurant.baseFee || 0} TND
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto w-[90%] py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>

        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold text-red-500 mb-4 capitalize">
              {findCategoryById(category)}
            </h3>
            <div className="grid gap-4">
              {categoryItems?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{item.ingredients.join(', ')}</p>
                      <p className="text-orange-500 font-bold text-lg">{Number(item.price).toFixed(2)} TND</p>
                    </div>
                    {item.imageUrl && (
                      <div className="ml-4 w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          width={80} height={80}
                          unoptimized
                        />
                      </div>
                    )}
                  </div>

                  <QuantityContainer key={item._id} item={item} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Commentaires */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Avis clients ({commentsFiltredByRestaurant.length})
            </h2>
          </div>

          {isAuthenticated && user && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Laisser un avis</h3>
                  <p className="text-sm text-gray-600">En tant que {user?.fullName}</p>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star, index) => {
                      if (index >= rateCount) {
                        return (
                          <button
                            key={star}
                            type="button"
                            className="text-2xl hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => { if (star === index + 1) setRateCount(c => c + 1); }}
                          >
                            <FaStar className="text-gray-300 hover:text-yellow-500" />
                          </button>
                        );
                      } else {
                        return (
                          <button
                            key={star}
                            type="button"
                            className="text-2xl hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => { if (star === index + 1) setRateCount(c => c - 1); }}
                          >
                            <FaStar className="text-yellow-500 hover:text-gray-300" />
                          </button>
                        );
                      }
                    })}
                    <span className="ml-2 text-sm text-gray-600">Cliquez pour noter</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                  <textarea
                    rows={4}
                    placeholder="Partagez votre expérience..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                    onChange={handleChangeComment}
                    value={commentContent}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 cursor-pointer"
                    onClick={(e) => { e.preventDefault(); }}
                  >
                    <FaPaperPlane className="text-sm" />
                    Publier l&apos;avis
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="text-center py-8">
            <p className="text-gray-500">Aucun avis pour le moment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
