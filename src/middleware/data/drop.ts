import { createImageUri } from '../../functions/createMetadata';
import { IDrop } from '../../models/types';
import { supabase } from '../../utils/supabaseClients';

export const createDrop = async ({
  drop,
  onSuccess = () => {},
  onError = () => {},
}: {
  drop: IDrop;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('drop_test')
    .insert({ ...drop })
    .select('*');

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getAllDrops = async ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase.from('drop_test').select('*');

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};
