/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @author Project Dome - Roque Costa
 */

define(
    [
        '../pd_pgp_service/pd-pgp-role.service.js',

        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-restlet.util.js',
    ],
    function (
        RoleService,

        RestletUtil
    ) {
        function getHandler() {
            return RestletUtil.api({
                method: 'GET',
                handler: getDefaultGlobalPermissionRoleURL
            }); 
        }

        function getDefaultGlobalPermissionRoleURL() {
            const _defaultRoleId = RoleService.getDefaultRoleId();

            return { url: 'https://7880315-sb1.app.netsuite.com/app/setup/role.nl?id=' + _defaultRoleId };
        }

        return {
            get: getHandler
        }
    }
)