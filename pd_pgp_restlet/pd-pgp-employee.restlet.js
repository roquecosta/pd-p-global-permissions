/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @author Project Dome - Roque Costa
 */

define(
    [
        'N/log',
         
        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-restlet.util.js',
        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-search.util.js'
    ],
    function (
        Log,

        RestletUtil,
        SearchUtil
    ) {
        const TYPE = 'employee';     
        const FIELDS = {
            hasAccess: { name: 'giveaccess', onlyFilter: true},
            id: { name: 'internalid' },
            name: { name: 'entityid' },
            subsidiary: { name: 'subsidiary' },
            role: { name: 'role', type: 'list' }
        };

        function getHandler(parameters) {
            return RestletUtil.api({
                method: 'POST',
                handler: getAllEmployeeWithAccess,
                data: parameters
            });              
        }

        function getAllEmployeeWithAccess(parameters) {
            function buildQuery(filters) {

                var _query = SearchUtil.where(SearchUtil.query(FIELDS.hasAccess, 'is', true));

                if (filters.employeeName) {
                    _query = _query.and(SearchUtil.query(FIELDS.name, 'contains', filters.employeeName))
                }
                if (filters.roleId) {
                    _query = _query.and(SearchUtil.query(FIELDS.role, 'is', filters.roleId))
                }
                if (filters.subsidiaryId) {
                    _query = _query.and(SearchUtil.query(FIELDS.subsidiary, 'is', filters.subsidiaryId))
                }

                return _query;
            }

            return SearchUtil.all({
                type: TYPE,
                columns: FIELDS,
                query: buildQuery(parameters)
            });
        }

        return {
            get: getHandler
        }
    }
)