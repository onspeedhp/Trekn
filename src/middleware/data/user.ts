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
