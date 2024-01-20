import { supabase } from "../../utils/supabaseClients";

export const insertUser = async ({
  props,
  onSuccess,
}: {
  props: any;
  onSuccess: (data: any) => void;
}) => {
  const { data, error } = await supabase.from("user").insert(props).select("*");
  if (!error) {
    onSuccess(data[0]);
  }
};

export const isUserIsExisted = async ({ email }: { email: any }) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email);

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
    .from("user")
    .select("*")
    .gt("point", 0)
    .order("point", { ascending: false })
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
  const { data, error } = await supabase.from("user").select("*, minted(*)");

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
    .from("user")
    .update({ ...updateData })
    .eq("id", userId)
    .select();

  if (!error) {
    onSuccess(data[0]);
  }
};

export const getFollowingById = async ({
  userId,
  onSuccess,
}: {
  userId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error }: any = await supabase
    .from("user")
    .select("follow(following)")
    .eq("id", userId);

  if (!error) {
    const result = data[0].follow.map((item: any) => item.following);
    onSuccess(result);
  }
};

export const getFollowerById = async ({
  userId,
  onSuccess,
}: {
  userId: number;
  onSuccess: (data: any) => void;
}) => {
  const { data, error }: any = await supabase
    .from("follow")
    .select("follower")
    .eq("following", userId);

  if (!error) {
    const result = data.map((item: any) => item.follower);
    onSuccess(result);
  }
};

export const getUserAccountData = async ({ userId }: { userId: number }) => {
  const { data, error }: any = await supabase
    .from("user")
    .select("*,drop(*,user(*), reaction(*)), minted(*,drop(*, user(*), reaction(*)), user(*))")
    .eq("id", userId);

  const { data: followerData, followerError }: any = await supabase
    .from("follow")
    .select("follower")
    .eq("following", userId);

  const { data: followingData, followingError }: any = await supabase
    .from("follow")
    .select("following")
    .eq("follower", userId);

  if (!error && !followerError && !followingError) {
    data[0].follower = followerData?.map((item: any) => item.follower);
    data[0].following = followingData?.map((item: any) => item.following);
    return data[0];
  }
};

export const getListUser = async (userId: Array<number>) => {
  const { data, error }: any = await supabase
    .from("user")
    .select("*")
    .or(`id.in.(${userId})`);

  if (!error) {
    return data;
  }
};
