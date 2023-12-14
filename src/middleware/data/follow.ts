import { supabase } from '../../utils/supabaseClients';

export const followUser = async ({ follower, following, onSuccess }:
    { follower: number, following: number, onSuccess: (data: any) => void }) => {
    const { data, error } = await supabase
        .from('follow')
        .insert({ follower, following })
        .select('following')

    if (!error) {
        onSuccess(data[0].following);
    }
}

export const unFollowUser = async ({ follower, following, onSuccess }:
    { follower: number, following: number, onSuccess: () => void }) => {
    const { data, error } = await supabase
        .from('follow')
        .delete()
        .eq('follower', follower)
        .eq('following', following)

    if (!error) {
        onSuccess();
    }
}