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

export const getLeadderBoardForDrop = async ({
  onSuccess,
}: {
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from('drop').select('user(*)');

  if (error) {
    console.error('Error: ', error);
  } else {
    const authorCounts: any = {};
    data.forEach((row: any) => {
      const author_id = row.user.id;

      if (authorCounts[author_id]) {
        authorCounts[author_id].count++;
      } else {
        authorCounts[author_id] = {
          count: 1,
          ...row.user,
        };
      }
    });

    const sortedAuthors = Object.keys(authorCounts).sort(
      (a, b) => authorCounts[b].count - authorCounts[a].count
    );

    if (sortedAuthors.length <= 7) {
      const sortedAuthorList = sortedAuthors.map((author_id) => {
        return {
          id: author_id,
          ...authorCounts[author_id],
        };
      });
      onSuccess(sortedAuthorList);
    } else {
      const topSevenAuthors = sortedAuthors.slice(0, 7).map((author_id) => {
        return {
          id: author_id,
          ...authorCounts[author_id],
        };
      });
      onSuccess(topSevenAuthors);
    }
  }
};
export const getLeadderBoardForMinted = async ({
  onSuccess,
}: {
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from('minted').select('user(*)');

  if (error) {
    console.error('Error: ', error);
  } else {
    const authorCounts: any = {};
    data.forEach((row: any) => {
      const author_id = row.user.id;

      if (authorCounts[author_id]) {
        authorCounts[author_id].count++;
      } else {
        authorCounts[author_id] = {
          count: 1,
          ...row.user,
        };
      }
    });

    const sortedAuthors = Object.keys(authorCounts).sort(
      (a, b) => authorCounts[b].count - authorCounts[a].count
    );

    if (sortedAuthors.length <= 7) {
      const sortedAuthorList = sortedAuthors.map((author_id) => {
        return {
          id: author_id,
          ...authorCounts[author_id],
        };
      });
      onSuccess(sortedAuthorList);
    } else {
      const topSevenAuthors = sortedAuthors.slice(0, 7).map((author_id) => {
        return {
          id: author_id,
          ...authorCounts[author_id],
        };
      });
      onSuccess(topSevenAuthors);
    }
  }
};
