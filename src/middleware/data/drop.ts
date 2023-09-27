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
  const imageUri = await createImageUri(drop.image_link);
  let new_drop: IDrop = { ...drop };
  new_drop.image_link = imageUri;

  console.log(imageUri);

  // const { data, error } = await supabase
  //   .from('drop_test')
  //   .insert(new_drop)
  //   .select('*');

  // if (!error) {
  //   onSuccess(data);
  // } else {
  //   onError('');
  // }
};
