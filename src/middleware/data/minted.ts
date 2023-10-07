import { supabase } from '../../utils/supabaseClients';

export const createMinted = async ({
  minted,
  onSuccess = () => {},
  onError = () => {},
}: {
  minted: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .insert({ ...minted })
    .select('*');

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getMintedByUserAddress = async ({
  userId,
  onSuccess = () => {},
  onError = () => {},
}: {
  userId: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .select(`*, drop(*)`)
    .eq('ownerId', userId);

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
