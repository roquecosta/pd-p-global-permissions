/**
 * @NApiVersion 2.x
 * @NModuleScope public
 * @author Project Dome - Roque Costa
 */

define(
    [
        'N/log',
        'N/search'
    ],
    function (
        Log,
        Search
    ) {
        const TYPE = 'role';     
        const FIELDS = {
            id: { name: 'internalid' },
            name: { name: 'name', onlyFilter: true },
            permissionType: { name: 'permission', type: 'list' },
            permissionLevel: { name: 'level', type: 'list' }
        };
        const GLOBAL_PERMISSIONS_ROLE_NAME = 'DOME - Permissões Globais';

        function getDefaultRoleId() {
            return Search.create({
                type: TYPE,
                filters: [
                    [FIELDS.name.name, 'IS', GLOBAL_PERMISSIONS_ROLE_NAME]
                ]
            }).run().getRange({ start: 0, end: 1 })[0].id;      
        }

        function getGlobalPermissionsDefaultRole() {
            try {
                var permissionsList = [];

                Search.create({
                    type: TYPE,
                    filters: [
                       [FIELDS.id.name, 'anyof', getDefaultRoleId()]
                    ],
                    columns: [
                        FIELDS.permissionType.name,
                        FIELDS.permissionLevel.name,
                    ]
                }).run().each(function(result) {
                    const permission = {
                        type: result.getValue(FIELDS.permissionType.name),
                        level: result.getValue(FIELDS.permissionLevel.name)
                    }
                    
                    permissionsList.push(permission);

                    return true;
                });

                return permissionsList;
            } catch (error) {
                Log.error('getGlobalPermissionsDefaultRole error', error);
                
                throw error;
            }
        }

        return {
            getDefaultRoleId: getDefaultRoleId,
            getGlobalPermissionsDefaultRole: getGlobalPermissionsDefaultRole
        }
    }
);