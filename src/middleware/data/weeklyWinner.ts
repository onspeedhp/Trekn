import { supabase } from "../../utils/supabaseClients";


export const getWeeklyWinner = async(userId: number) => {
    const {data, error} = await supabase.from('weekly_winner').select('*').eq('userId', userId);
    if(error) {
        console.log(error);
    }
    if(data) {
        return data[0];
    }
}