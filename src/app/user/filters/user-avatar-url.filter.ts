import { fullImageUrl } from "../../share/image";

export const userAvatarUrl = () =>
    (user) => `${user && user.public && user.public.hasOwnProperty('avatar') && user.public.avatar !== 'default.jpg' ?  fullImageUrl() ('/user/avatar/',user.public.avatar) : '/assets/picture/default_avatar.png'}`;