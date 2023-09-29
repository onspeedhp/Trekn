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
  userAddress,
  onSuccess = () => {},
  onError = () => {},
}: {
  userAddress: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .select(`*, drop(*)`)
    .eq('who', userAddress);

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
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('minted')
    .select(`*, drop(*)`)
    .eq('id', mintedId);

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};
