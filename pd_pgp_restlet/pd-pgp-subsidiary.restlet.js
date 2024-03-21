/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @author Project Dome - Roque Costa
 */

define(
    [
        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-search.util.js',
        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-restlet.util.js',
    ],
    function (
        SearchUtil,
        RestletUtil
    ) {
        const TYPE = 'subsidiary';
        
        const FIELDS = {
            id: { name: 'internalid' },
            name: { name: 'name' }
        };

        function getHandler() {
            return RestletUtil.api({
                method: 'POST',
                handler: getAllSubsidiaries
            });              
        }

        function getAllSubsidiaries() {
            return SearchUtil.all({
                type: TYPE,
                columns: FIELDS
            });
        }

        return {
            get: getHandler
        }
    }
)