/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@author Project Dome - Roque Costa
 */
define(
    [
        '../../pd_c_netsuite_tools/pd_cnt_standard/pd-cnts-suitelet.util'
    ],
    function (
        suitelet_util
    ) {

        function onRequest(context) {
            globalPermissionsManagementScreen(context);
        };

        function globalPermissionsManagementScreen(context) {

            return suitelet_util.build({
                context: context,
                title: 'Gerenciamento de Permissões Globais',
                statics: {
                    html: (
                        [
                            'pd-pgp-global-permissions.html'
                        ]
                    ),
                    js: (
                        [
                            'pd-pgp-global-permissions.js'
                        ]
                    )
                }
            });
        };

        return {
            onRequest: onRequest
        }
    });