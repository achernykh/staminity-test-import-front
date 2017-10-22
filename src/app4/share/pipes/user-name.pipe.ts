import { Pipe, PipeTransform } from "@angular/core";
import { IUserProfilePublic } from "../../../../api/user/user.interface";
import { prop, maybe } from "../utilities/common";

@Pipe({ name: 'userName' })
export class UserNamePipe implements PipeTransform {

    transform(user: IUserProfilePublic, options: string): string {
        return maybe(user)
            (prop('public'))
            (options === 'short' ? prop('firstName') : ({ firstName, lastName }) => `${firstName} ${lastName}`)();
    }
}