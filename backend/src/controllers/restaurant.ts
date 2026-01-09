import {Request, Response} from 'express';
import  Restaurant from '../models/Restaurant';

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

      // Construire l'objet de mise à jour dynamiquement
      const updateData: any = {
        ...req.body
      };

      // Ajouter img seulement si un nouveau fichier a été uploadé
      if (imgFile) {
        updateData.img = `${req.protocol}://${req.get('host')}/images/${imgFile.filename}`;
      }

      // Ajouter coverImg seulement si un nouveau fichier a été uploadé
      if (coverFile) {
        updateData.coverImg = `${req.protocol}://${req.get('host')}/images/${coverFile.filename}`;
      }

      await Restaurant.updateOne({_id: userId}, updateData);

      
      res.status(200).json({msg:'restaurant updated!'});
      
    } catch (error) {
        res.status(500).json({error})
    }
    
}