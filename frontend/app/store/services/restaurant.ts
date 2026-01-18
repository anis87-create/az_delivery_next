import axios from 'axios';
const API_URL = 'http://localhost:5000/api/owner/restaurant';

export const restaurantService = {
    async update(restaurantId: string, restaurantData:any){
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
       const response = await axios.put(`${API_URL}/${restaurantId}`, restaurantData, {
            headers: {
                'Authorization':`Bearer ${token}`
            }
        });

        return response.data;
    }
}