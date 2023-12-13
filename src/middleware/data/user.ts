import { supabase } from '../../utils/supabaseClients';

export const insertUser = async ({
  props,
  onSuccess,
}: {
  props: any;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from('user').insert(props).select('*');
  if (!error) {
    onSuccess(data[0]);
  }
};

export const isUserIsExisted = async ({ email }: { email: any }) => {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email);

  if (!error) {
    if (data?.length === 0) {
      return { isUserIsExist: false, data: [] };
    } else {
      return { isUserIsExist: true, data: data[0] };
    }
  }

  return { isUserIsExist: false, data: [] };
};

export const getLeaderBoardPoint = async ({
  onSuccess,
}: {
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .gt('point', 0)
    .order('point', { ascending: false })
    .limit(10);

  if (!error) {
    onSuccess(data);
  }
};

export const getUserByDropId = async ({
  dropId,
  onSuccess,
}: {
  dropId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from('user').select('*, minted(*)');

  if (!error) {
    const result = data
      .map((user: any) => {
        if (user.minted && Array.isArray(user.minted)) {
          const minted = user.minted.filter(
            (item: any) => item.drop_id === dropId
          );
          if (minted.length) {
            return { ...user, minted };
          }
        }
        return null;
      })
      .filter(Boolean);
    onSuccess(result);
  }
};

export const updateUserDB = async ({
  userId,
  updateData,
  onSuccess,
}: {
  userId: number;
  updateData: any;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase
    .from('user')
    .update({ ...updateData })
    .eq('id', userId)
    .select();

  if (!error) {
    onSuccess(data[0]);
  }
};

export const getFollowingById = async ({
  userId,
  onSuccess
}: {
  userId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase
  .from('user')
  .select("following")
  .eq('id', userId);

  if (!error) {
    onSuccess(data[0]);
  }
}
