/**
 * @NApiVersion 2.x
 * @NModuleScope public
 * @author Project Dome - Roque Costa
 */

define(
    [
        'N/log',

        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-search.util.js',
    ],
    function (
        Log,

        SearchUtil
    ) {
        const TYPE = 'employee';     
        const FIELDS = {
            id: { name: 'internalid', onlyFilter: true },
            globalPermission: { name: 'globalPermission', type: 'list' },
        };

        function getEmployeeGlobalPermissionsByEmployeeId(employeeId) {
            try {
                const _employeeList = SearchUtil.all({
                    type: TYPE,
                    columns: FIELDS,
                    query: SearchUtil
                        .where(SearchUtil.query(FIELDS.id, 'anyof', employeeId))
                });

                return _employeeList.map(function(employee) { return employee.globalPermission.id });

            } catch (error) {
                Log.error('getEmployeeGlobalPermissionsByEmployeeId error', error);

                throw error;
            }
        }

        return {
            getEmployeeGlobalPermissionsByEmployeeId: getEmployeeGlobalPermissionsByEmployeeId
        }
    }
);