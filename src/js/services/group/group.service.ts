import {IGroupProfile, IGroupProfileShort} from 'group.interface';
import {ISocketService, IWSRequest} from '../api/socket.service';

// Сборщик запроса getGroupProfile
class GetRequest implements IWSRequest {
	requestType:string;
	requestData:{
		groupId:number;
		groupUri:string //<groupType>/<groupCode> либо по URI
	}

	constructor(id:number, uri:string = "") {
		this.requestType = 'getGroupProfile';
		this.requestData.groupId = id;
		this.requestData.groupUri = uri;
	}
}
// Сборщик запроса putGroup
class PutRequest implements IWSRequest {
	requestType:string;
	requestData:IGroupProfile;

	constructor(profile:IGroupProfile) {
		this.requestType = 'putGroup';
		this.requestData = profile;
	}
}
// Сборщик запроса joinGroup
class JoinRequest implements IWSRequest {
	requestType:string;
	requestData:{
		groupId:number
	};

	constructor(id:number) {
		this.requestType = 'joinGroup';
		this.requestData.groupId = id;
	}
}
// Сборщик запроса leaveGroup
class LeaveRequest implements IWSRequest {
	requestType:string;
	requestData:{
		groupId:number
	};

	constructor(id:number) {
		this.requestType = 'leaveGroup';
		this.requestData.groupId = id;
	}
}
// Сборщик запроса getGroupMembershipRequest
class GetMembershipRequest implements IWSRequest {
	requestType:string;
	requestData:{
		offset:number, // сдвиг относительно выбранного идентификатора
		limit:number // кол-во возвращаемых результатов
	};

	constructor(offset:number, limit:number) {
		this.requestType = 'getGroupMembershipRequest';
		this.requestData.offset = offset;
		this.requestData.limit = limit;
	}
}
// Сборщик запроса processGroupMembershipRequest
class ProcessMembershipRequest implements IWSRequest {
	requestType:string;
	requestData:{
		userGroupRequest:number, // groupMembershipRequest.userGroupRequestId
		targetState:string // A = Accepted; D = Declined; C = Cancelled
	};

	constructor(request:number, state:string) {
		this.requestType = 'processGroupMembershipRequest';
		this.requestData.userGroupRequest = request;
		this.requestData.targetState = state;
	}
}
// Сборщик запроса getGroupMembership
class GetMembersRequest implements IWSRequest {
	requestType:string;
	requestData:{
		groupId:number
	};

	constructor(id:number) {
		this.requestType = 'getGroupMembership';
		this.requestData.groupId = id;
	}
}

export default class GroupService {
	SocketService:ISocketService

	constructor(SocketService:ISocketService) {
		this.SocketService = SocketService;
	}

	/**
	 * Запрос профиля группы
	 * @param id
	 * @param uri
	 * @returns {Promise<IGroupProfile>}
	 */
	getProfile(id: number, uri: string):Promise<IGroupProfile> {
		return this.SocketService.send(new GetRequest(id,uri))
			.then((profile:IGroupProfile) => {
				return profile
			});
	}

}


