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
  const newDrop = {
    ...drop,
    attributes: {
      'Drop name': drop.name,
      'Drop location': drop.location_name,
      'Drop description': drop.description,
    },
  };
  const { data, error } = await supabase
    .from('drop')
    .insert(newDrop)
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
  const { data, error } = await supabase.from('drop').select('*');

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getDropByUserAddress = async ({
  userAddress,
  onSuccess = () => {},
  onError = () => {},
}: {
  userAddress: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('drop')
    .select('*')
    .eq('creator_address', userAddress);

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getDropByID = async ({
  dropId,
  onSuccess = () => {},
  onError = () => {},
}: {
  dropId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('drop')
    .select('*')
    .eq('id', dropId);

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const updateDrop = async ({
  value,
  dropId,
  onSuccess = () => {},
  onError = () => {},
}: {
  value: string;
  dropId: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data: drop, error } = await supabase
    .from('drop')
    .select('*')
    .eq('id', dropId);

  if (!error) {
    const reaction_counts = drop[0].reaction_counts;
    reaction_counts[value] += 1;
    const { error } = await supabase
      .from('drop')
      .update({ reaction_counts: reaction_counts })
      .eq('id', dropId);

    onSuccess('');

    if (error) {
      onError(error);
    }
  } else {
    onError(error);
  }
};
