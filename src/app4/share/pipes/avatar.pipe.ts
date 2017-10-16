import { Pipe, PipeTransform } from "@angular/core";
import { IUserProfileShort } from "../../../../api/user/user.interface";
import { ImagePipe } from "./image.pipe";

@Pipe({ name: 'avatar' })
export class AvatarPipe implements PipeTransform{

    constructor(private image: ImagePipe) {}

    transform(user: IUserProfileShort): string {
        return `url(${user && user.public && user.public.hasOwnProperty('avatar') && user.public.avatar !== 'default.jpg' ?
            this.image.transform('/user/avatar/',user.public.avatar) :
            '/assets/picture/default_avatar.png'})`;
    }
}