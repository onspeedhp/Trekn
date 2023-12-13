import { supabase } from '../../utils/supabaseClients';

export const createMinted = async ({
  userId,
  drop,
  image,
  description,
  onSuccess = () => {},
  onError = () => {},
}: {
  userId: any;
  drop: any;
  image?: string;
  description?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .insert({
      ownerId: userId,
      drop_id: drop.id,
      ...(image && { image }),
      ...(description && { description }),
    })
    .select('*');

  if (!error) {
    // check if user is owned of this drop
    if (userId !== drop.user.id) {
      // increase the owner of drop
      await supabase
        .from('user')
        .update({ point: drop.user.point + 2 })
        .eq('id', drop.user.id);
    }
    // increase the collected of drop
    await supabase
      .from('drop')
      .update({ collected: drop.collected + 1 })
      .eq('author_id', drop.user.id);

    onSuccess(data[0]);
  } else {
    onError('');
  }
};

export const getMintedByUserAddress = async ({
  userId,
  onSuccess = () => {},
  onError = () => {},
}: {
  userId: Array<number>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .select(`*, drop(*, user(*))`)
    .or(`ownerId.in.(${userId})`);

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getMintedById = async ({
  mintedId,
  onSuccess = () => {},
  onError = () => {},
}: {
  mintedId: string;
  onSuccess?: (data: any, count: number) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .select(`*, drop(*, user(*))`)
    .eq('id', mintedId);

  if (data) {
    const { count, error } = await supabase
      .from('minted')
      .select('ownerId', { count: 'exact', head: true })
      .eq('drop_id', data[0].drop_id);
    if (count) {
      onSuccess(data, count);
    } else {
      onError(error);
    }
  } else {
    onError(error);
  }
};
