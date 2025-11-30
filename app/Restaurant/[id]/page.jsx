'use client'
import { FaPaperPlane, FaStar, FaHeart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { HiOutlineHeart } from 'react-icons/hi';
import { useAppSelector } from '../../hooks.js';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Avatar from '@/app/components/common/Avatar.jsx';
import QuantityContainer from '@/app/components/QuantityContainer.jsx';


const RestaurantPage = () => {
  const { id } = useParams();
  const {restaurants} = useAppSelector(state => state.restaurant);
  const restaurant = restaurants.find((restaurant) => restaurant.id === Number(id));

  const { items }  = useAppSelector(state => state.items);
  //const comments = getCommentsByRestaurantId(parseInt(id))
  //const totalComments = getTotalCommentsCount(parseInt(id))
  const { currentUser, isAuth } = useAppSelector (state => state.auth);
  // Récupère tous les commentaires depuis le store Redux
 // const { comments } = useAppSelector(state => state.comment);
  // Récupère la liste des utilisateurs pour afficher les noms dans les commentaires
  const { users } = useAppSelector(state => state.auth);
  const [buttonHidden, setButtonHidden] = useState(false);
  const dispatch = useDispatch();
  // État local pour stocker le contenu du commentaire en cours de rédaction
  const [commentContent, setCommentContent] = useState('');
  // État local pour stocker la note (nombre d'étoiles) sélectionnée par l'utilisateur
  const [rateCount, setRateCount] = useState(0);
  // État local pour stocker les commentaires filtrés appartenant au restaurant actuel
  const [commentsFiltredByRestaurant, setCommentsFiltredByRestaurant] = useState([]);
  const {categories} = useAppSelector(state => state.categories);
 
  
  /**
   * Effect hook pour filtrer les commentaires du restaurant et calculer la note moyenne
   * S'exécute à chaque changement de la liste des commentaires, de l'ID du restaurant ou du dispatch
   */
  useEffect(() => {}, []);
  
  const addItem = () => {
    setButtonHidden(true);
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
    )
  }

  const groupedItems = items.filter((item) => Number(id) === item.restaurantId).reduce((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = []
    }
    acc[item.categoryId].push(item)
    return acc
  }, {});
  const findCategoryById = (categoryId) => categories?.find((category) => category.id === Number(categoryId))?.name;

  /**
   * Fonction pour soumettre un nouveau commentaire
   * Ajoute le commentaire au store Redux et réinitialise le formulaire
   */
  const reply = (comment) => {
    // dispatch(addComment(comment));
     // Réinitialise le champ de texte du commentaire
     setCommentContent('');
     // Réinitialise la note à 0 étoiles
     setRateCount(0);
  }

  /**
   * Gestionnaire d'événement pour le changement du texte du commentaire
   * Met à jour l'état local avec le contenu saisi par l'utilisateur
   */
  const handleChangeComment = (e) => {
    setCommentContent(e.target.value);
  }

  /**
   * Trouve et retourne le nom complet de l'utilisateur qui a écrit un commentaire
   */
  const findCommentUserName = (comment) => {
    return users?.find(user => comment?.userId ===  user?.id)?.fullName;
  }




  return (
    <div className="min-h-screen bg-gray-50 mt-32.5">
      {/* Header avec image du restaurant */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={restaurant.coverImg} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
          width={80}
          height={80}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Bouton retour */}
        <Link
          href="/"
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
        >
          <FaArrowLeft className="text-gray-800" />
        </Link>

        {/* Informations du restaurant */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdAccessTime />
              <span>{restaurant.deliverySettings?.estimatedDeliveryTime || '10-30 min'}</span>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            {restaurant.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Delivery Info */}
          <div className="flex gap-4 text-sm">
            <span className="bg-orange-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
              Delivery: {restaurant.deliverySettings?.deliveryFee || 0} TND
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto w-[90%] py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
        
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
            {findCategoryById(category)}
            </h3>
            <div className="grid gap-4">
              {categoryItems?.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.ingredients.join(', ')}
                      </p>
                      <p className="text-orange-500 font-bold text-lg">
                        {Number(item.price).toFixed(2)} TND
                      </p>
                    </div>
                    {item.imageUrl && (
                      <div className="ml-4">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          width={20}
                          height={20}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Contrôles de quantité */}
                  <QuantityContainer
                   key={item.id}
                   addItem={addItem}
                   item={item}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Section Commentaires - Affiche tous les avis clients pour ce restaurant */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            {/* Titre avec le nombre total de commentaires filtrés pour ce restaurant */}
            <h2 className="text-2xl font-bold text-gray-800">
              Avis clients ({commentsFiltredByRestaurant.length})
            </h2>
          </div>

          {/* Formulaire d'ajout de commentaire - Visible uniquement si l'utilisateur est authentifié */}
          {isAuth && currentUser && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar utilisateur connecté */}
    
              <Avatar name={`${currentUser?.fullName || 'User'}`} size="w-[40px] h-[40px]" 
                     fontSize='text-xs'
                    />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Laisser un avis</h3>
                <p className="text-sm text-gray-600">En tant que {currentUser?.fullName}</p>
              </div>
            </div>
            
            <form className="space-y-4">
              {/* Système d'étoiles pour la notation (1-5 étoiles) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre note
                </label>
                <div className="flex items-center gap-1">
                  {/* Génère 5 boutons étoiles. Cliquer augmente/diminue rateCount */}
                  {[1, 2, 3, 4, 5].map((star, index) => {
                    // Si l'étoile n'est pas encore sélectionnée (index >= rateCount)
                    if(index >= rateCount){
                      return(
                         <button
                      key={star}
                      type="button"
                      className="text-2xl hover:scale-110 transition-transform"
                      onClick={() => {
                        // Augmente le compteur d'étoiles lors du clic
                        if(star === index+1){
                          setRateCount(c => c  + 1);
                        }
                      }}
                    >
                      {/* Étoile grise non sélectionnée */}
                      <FaStar className="text-gray-300 hover:text-yellow-500" />
                    </button>
                      )
                    }else {
                      return(
                         <button
                      key={star}
                      type="button"
                      className="text-2xl hover:scale-110 transition-transform"
                      onClick={() => {
                        // Diminue le compteur d'étoiles lors du clic sur une étoile déjà sélectionnée
                        if(star === index+1){
                        setRateCount(c => c - 1);
                        }
                      }}
                    >
                      {/* Étoile jaune sélectionnée */}
                      <FaStar className="text-yellow-500 hover:text-gray-300" />
                    </button>
                      )
                    }

                  })}
                  <span className="ml-2 text-sm text-gray-600">Cliquez pour noter</span>
                </div>
              </div>

              {/* Champ de texte pour le commentaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire
                </label>
                {/* Textarea contrôlé par commentContent et handleChangeComment */}
                <textarea
                  rows={4}
                  placeholder="Partagez votre expérience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                  onChange={handleChangeComment}
                  value={commentContent}
                ></textarea>
              </div>

              {/* Bouton d'envoi du commentaire */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  onClick={ (e) => {
                    e.preventDefault();
                    // Appelle la fonction reply pour soumettre le nouveau commentaire
                    reply({
                    restaurantId: restaurant.id,
                    userId: currentUser.id,
                    userName: currentUser?.fullName || 'User',
                    userAvatar: currentUser?.avatar,
                    comment: commentContent, // Contenu du commentaire saisi
                    likes: 0,
                    rating: rateCount // Nombre d'étoiles sélectionnées
                  })}


                }
                >
                  <FaPaperPlane className="text-sm" />
                  Publier l&apos;avis
                </button>
              </div>
            </form>
          </div>
          )}

          {/* Affichage conditionnel des commentaires : liste ou message "Aucun avis" */}
          {commentsFiltredByRestaurant.length > 0 ? (
            <div className="space-y-6">
              {/* Boucle sur tous les commentaires filtrés pour ce restaurant */}
              {commentsFiltredByRestaurant?.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  {/* Header du commentaire avec avatar et informations utilisateur */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Affiche l'avatar de l'utilisateur s'il existe, sinon affiche Avatar avec initiales */}
                    {users?.find(user => comment?.userId === user?.id)?.avatar ? (
                      <Image
                        src={users.find(user => comment?.userId === user?.id).avatar}
                        alt={findCommentUserName(comment)}
                        className="w-[32px] h-[32px] rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <Avatar
                        name={`${findCommentUserName(comment)}`}
                        size="w-[32px] h-[32px]"
                        fontSize='text-xs'
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        {/* Nom de l'utilisateur qui a écrit le commentaire */}
                        <h4 className="font-semibold text-gray-800">{comment.userName}</h4>
                        {/* Date de création du commentaire formatée en français */}
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Affichage de la note sous forme d'étoiles (Rating) */}
                      <div className="flex items-center gap-1 mb-3">
                        {/* Génère 5 étoiles, colorées selon la note du commentaire */}
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`text-sm ${
                              index < comment.rating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        {/* Affiche la note numérique */}
                        <span className="text-sm text-gray-600 ml-2">
                          {comment.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Contenu textuel du commentaire */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {comment.comment}
                  </p>

                  {/* Actions disponibles pour chaque commentaire (Like et Supprimer) */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Bouton Like - Change de couleur si l'utilisateur a déjà liké */}
                    <button className={`flex items-center gap-2 ${comment.likedBy && comment.likedBy.includes(currentUser.id) ? "text-red-500 hover:text-gray-500" : "text-gray-500 hover:text-red-600"} transition-colors`}
                     onClick={() => {
                      // Dispatch l'action toggleLike pour ajouter/retirer le like
                      dispatch(toggleLike({
                        commentId: comment.id,
                        userId: currentUser.id
                      }));
                    }}
                    >
                      {/* Affiche le nombre de likes si > 0 */}
                      <span className="text-sm">{comment.likes>0 ? comment.likes: ''}</span>
                      <FaHeart className="text-sm" />
                    </button>


                      {/* Bouton Supprimer le commentaire */}
                      <button
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
                        onClick={() => {
                          // Dispatch l'action removeComment pour supprimer le commentaire
                          dispatch(removeComment({
                            id: comment.id
                          }));
                        }}
                      >
                        <FaTrash className="text-sm" />
                      </button>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Affiche un message si aucun commentaire n'existe pour ce restaurant
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun avis pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
