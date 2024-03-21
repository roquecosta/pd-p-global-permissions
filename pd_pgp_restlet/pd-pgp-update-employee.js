/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @author Project Dome - Roque Costa
 */

define(
    [
        'N/log',
        'N/record',

        '../pd_pgp_service/pd-pgp-role.service.js',
        '../pd_pgp_service/pd-pgp-employee.service.js',

        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-restlet.util.js',
        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-record.util.js'
    ],
    function (
        Log,
        Record,
        
        RoleService,
        EmployeeService,

        RestletUtil,
        RecordUtil
    ) {
        const TYPE = 'employee';

        const GLOBAL_PERMISSIONS_SUBLIST_ID = 'empperms';
        const GLOBAL_PERMISSIONS_SUBLIST_FIELDS = {
            permissionType: { name: 'permkey1' },
            permissionLevel: { name: 'permlevel1' }
        };

        function postHandler(parameters) {
            return RestletUtil.api({
                method: 'POST',
                handler: updateEmployeeGlobalPermissionsUsingDefaultRole,
                data: parameters.employeeList
            });              
        }

        function updateEmployeeGlobalPermissionsUsingDefaultRole(employeeList) {
            const _globalPermissionsList = RoleService.getGlobalPermissionsDefaultRole();

            try {
                employeeList.forEach(function (employee) {

                    const _employeeCurrentGlobalPermissions = EmployeeService.getEmployeeGlobalPermissionsByEmployeeId(employee.employeeId);

                    // Removing permissions that employee already has from list
                    const _newEmployeeGlobalPermissionsList = _globalPermissionsList
                            .filter(function (permission) { return _employeeCurrentGlobalPermissions.indexOf(permission.type) === -1 });

                    const _employeeRecord = Record.load({
                        type: TYPE,
                        id: employee.employeeId
                    });

                    var _patchData = { sublists: {} };

                    _patchData.sublists[GLOBAL_PERMISSIONS_SUBLIST_ID] = buildLines(_newEmployeeGlobalPermissionsList);

                    RecordUtil
                        .handler(_employeeRecord)
                        .set(_patchData)
                        .save({ ignoreMandatoryFields: true });
                });
            } catch (error) {
                Log.error('updateEmployeeGlobalPermissionsUsingDefaultRole error', error);
            }
        }

        function buildLines(globalPermissionsList) {
            var _lines = [];

            globalPermissionsList.forEach(function(globalPermission) {
                var _lineData = {};

                _lineData[GLOBAL_PERMISSIONS_SUBLIST_FIELDS.permissionType.name] = globalPermission.type;
                _lineData[GLOBAL_PERMISSIONS_SUBLIST_FIELDS.permissionLevel.name] = globalPermission.level;

                _lines.push(_lineData);
            });

            return _lines;
        }

        return {
            post: postHandler
        }
    }
)