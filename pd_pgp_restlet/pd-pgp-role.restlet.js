/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @author Project Dome - Roque Costa
 */

define(
    [
        'N/query',

        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-restlet.util.js'
    ],
    function (
        Query,

        RestletUtil
    ) {
        function getHandler() {
            return RestletUtil.api({
                method: 'GET',
                handler: getAllRoles
            }); 
        }

        function getAllRoles() {
            const _searchedRoleList = Query.runSuiteQL({
                query: 'SELECT role.id, name FROM role'
            }).results; 
            var _roleList = [];

            _searchedRoleList.forEach(function(role) {
                const _role = {
                    id: String(role.values[0]),
                    name: role.values[1]
                }
                _roleList.push(_role);
            });

            return _roleList;
        }

        return {
            get: getHandler
        }
    }
)