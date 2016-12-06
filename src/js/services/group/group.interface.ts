import {IUserProfileShort} from '../user/user.interface'
// Профайл группы: public секция
interface IGroupProfilePublic {
	name:string,
	avatar:string,
	background:string,
	country:string,
	city:string,
	timezone:string,
	activityTypes:Array<string>,
	about:string
}
// Профайл группы
export interface IGroupProfile {
	groupId:number,
	revision:number,
	groupIdParent:number, // ссылка на родительскую группу
	groupCode:string,
	groupName:string,
	groupType:string, //club/group тип отображения профиля группы
	groupUri:string, // суффикс относительного адреса страницы профиля группы в системе. Пример: /<groupType>/<uri>

	public:IGroupProfilePublic,

	isSystem:boolean, // системная группа или нет

	joinPolicy:string, // Каким образом возможно стать членом данной группы:
                       // [I] - By Invitation Only;
                       // [R] - By Invitation or By Request;
                       // [O] - Open Group - вход без необходимости подтверждения владельцем;
                       // [C] - Closed Group - закрытая группа для личных целей владельца;
	leaveByRequest:boolean, // необходимо ли подтверждение владельца для выхода из группы

	// члены группы
	groupMembersCount:number, // кол-во членов группы. Отсутствует, если владелец группы скрыл состав членов на уровне
	// настроек приватности.
	groupMembers:[
		{
			userProfile:IUserProfileShort,
			roleMembership:Array<number>, //groupProfile.groupCode
			coaches:Array<IUserProfileShort>,
			tariffs:[
				{
					tariffId:number,
					tariffCode:string,
					userProfilePayer:IUserProfileShort, // тот, кто купил пользователю этот тариф
					started:Date,
					expires:Date
				}
				]
		}
		],
	// вложенные группы
	innerGroups:{
		[GroupCode:string]:IGroupProfileShort
	},
	// кнопки возможного взаимодействия, доступные посетителю профиля
	availableInteractions:{
		btnJoinGroup:boolean,
		btnCancelJoinGroup:boolean,
		btnLeaveGroup:boolean,
		btnCancelLeaveGroup:boolean
	}

}
// Краткая версия проифля группы
export interface IGroupProfileShort {
	groupId:number,
	revision:number,
	groupCode:string,
	groupName:string,
	groupType:string,
	groupMembersCount:number,
	public:IGroupProfilePublic
}
;