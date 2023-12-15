import { IDrop } from '../../models/types';
import { supabase } from '../../utils/supabaseClients';

export const createDrop = async ({
  drop,
  user,
  onSuccess = () => {},
  onError = () => {},
}: {
  drop: IDrop;
  user?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const newDrop = {
    ...drop,
    collected: 0,
  };
  await supabase
    .from('user')
    .update({ point: user.point + 1 })
    .eq('id', user.id);

  const { data, error } = await supabase
    .from('drop')
    .insert(newDrop)
    .select('*, user(*)');

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
  const { data, error } = await supabase.from('drop').select('*, user(*)');
  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const getDropByUserAddress = async ({
  userId,
  onSuccess = () => {},
  onError = () => {},
}: {
  userId: Array<number>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const { data, error } = await supabase
    .from('drop')
    .select('*,user(*)')
    .or(`author_id.in.(${userId})`);

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
    .select('*, user(*), minted(*, user(*), reaction(*))')

    .eq('id', dropId);

  if (!error) {
    onSuccess(data);
  } else {
    onError('');
  }
};

export const updateDrop = async ({
  value,
  drop,
  userId,
  onSuccess = () => {},
  onError = () => {},
}: {
  userId: number;
  value: string;
  drop: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const reaction_counts = drop.reaction_counts;
  reaction_counts[value] += 1;
  const { error } = await supabase
    .from('drop')
    .update({ reaction_counts: reaction_counts })
    .eq('id', drop.id);

  if (userId !== drop.user.id) {
    if (value === '1' || value === '0') {
      await supabase
        .from('user')
        .update({ point: drop.user.point + 3 })
        .eq('id', drop.user.id);
    }
  }

  if (error) {
    onError(error);
  }
};
