import { IBulkGroupMembership } from '../../../api';

/**
 * Объект, представляющий действие подключения к группе
 * @param groupId: number
 * @returns {IBulkGroupMembership}
 */  
export const addToGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'I' });

/**
 * Объект, представляющий действие отключения от группы
 * @param groupId: number
 * @returns {IBulkGroupMembership}
 */  
export const removeFromGroup = (groupId: number) : IBulkGroupMembership => ({ groupId, direction: 'O' });