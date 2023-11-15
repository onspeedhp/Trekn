import { supabase } from '../../utils/supabaseClients';

export const addReaction = async ({
  dropId,
  userId,
  value,
}: {
  dropId: any;
  userId: any;
  value: number;
}) => {
  const { error } = await supabase.from('reaction').insert({
    drop_id: dropId,
    user_id: userId,
    kind: value,
  });

  if (error) {
    console.log(error);
  }
};
