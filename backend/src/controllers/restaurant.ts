import {Request, Response} from 'express';
import  Restaurant from '../models/Restaurant';
import Item from '../models/Items';

export const updateRestaurant = async (req: Request, res: Response) => {
    const userId:string|undefined = req.params.id;
    try {
      if(!userId){
         return res.status(400).send({message:'userId is missing'})
      }  
      if(!req.body.name){
        res.status(404).json({message:'the restaurant name is required'});
      }
      if(!req.body.email){
        res.status(404).json({message:'the restaurant email is required'});
      }

      if(!req.body.city){
        res.status(404).json({message:'the restaurant city is required'});
      }

      if(!req.body.zipCode){
        res.status(404).json({message:'the restaurant zipCode is required'});
      }

      if(!req.body.street){
        res.status(404).json({message:'the restaurant street is required'});
      }

      if(!req.body.phone){
        res.status(404).json({message:'the restaurant phone is required'});
      }



      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const imgFile = files?.img?.[0];
      const coverFile = files?.coverImg?.[0];

      // Débogage : voir tout ce qui arrive

      // Construire l'objet de mise à jour dynamiquement
      const {openingHours, ...restOfBody} = req.body;
      const updateData: any = {
        ...restOfBody
      };

      // Ajouter img seulement si un nouveau fichier a été uploadé
      if (imgFile) {
        updateData.img = `${req.protocol}://${req.get('host')}/images/${imgFile.filename}`;
      }

      // Ajouter coverImg seulement si un nouveau fichier a été uploadé
      if (coverFile) {
        updateData.coverImg = `${req.protocol}://${req.get('host')}/images/${coverFile.filename}`;
      }
      // Parser openingHours si présent
      if (openingHours) {
        updateData.openingHours = JSON.parse(openingHours);
      }

      await Restaurant.updateOne({_id: userId}, updateData);

      
      res.status(200).json({msg:'restaurant updated!'});

    } catch (error) {
        console.error('Erreur lors de la mise à jour du restaurant:', error);
        res.status(500).json({
          message: 'Erreur lors de la mise à jour',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
    
}

export const getAllRestaurants = async (req:Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
     console.log(error);
  }
}

export const getOneRestaurant = async (req: Request, res:Response) => {
  try {
    const { id } = req.params;
    if(!id){
      return res.status(200).json({msg:'the id is not defined!'});
    }
    const restaurant = await Restaurant.findById(id);
  
    const restaurantItems = await Item.find({restaurantId: id});
    res.status(200).json({
      restaurant,
      items: restaurantItems
    });
  } catch (error) {
    console.log(error);
  }
}