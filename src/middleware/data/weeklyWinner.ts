import { supabase } from "../../utils/supabaseClients";


export const getWeeklyWinner = async (userId: number) => {
    const { data, error } = await supabase.from('weekly_winner').select('*').eq('userId', userId);
    if (error) {
        console.log(error);
    }
    if (data) {
        return data[0];
    }
}

export const updateWeeklyWinner = async (winner: any, updateData: any) => {
    const { error } = await supabase.from('weekly_winner').update({ ...winner, ...updateData }).eq('id', winner.id)

    if (error) {
        console.log(error);
    }
}