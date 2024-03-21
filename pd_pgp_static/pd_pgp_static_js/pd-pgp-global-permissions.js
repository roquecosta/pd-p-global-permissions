const EMPLOYEE_RESTLET = {
    script: 'customscript_pd_pgp_employee',
    deployment: 'customdeploy_pd_pgp_employee'
};

const UPDATE_EMPLOYEE_RESTLET = {
    script: 'customscript_pd_pgp_upd_employee_rl',
    deployment: 'customdeploy_pd_pgp_upd_employee_rl'
};

const ROLE_URL_RESTLET = {
    script: 'customscript_pd_pgp_role_url',
    deployment: 'customdeploy_pd_pgp_role_url'
}

const EMPLOYEES_TABLE_ID = '#employees';

const EMPLOYESS_TABLE_COLUMNS = [
    { name: 'checkbox', title: 'Selecionar', checkbox: true },
    { name: 'employeeName', title: 'Usuário' },
    { name: 'role', title: 'Papel' }
];

$(document).ready(function () {
    loadEmployees();
});

function loadEmployees(filters) {
    let _loadingModal = loading('Carregando usuários...');

    buildTable({
        id: EMPLOYEES_TABLE_ID,
        columns: EMPLOYESS_TABLE_COLUMNS,
        restlet: EMPLOYEE_RESTLET,
        parameters: filters,
        searchingText: 'Buscando...',
        emptyDataMessage: 'Nenhum resultado encontrado!',
        loadingText: 'Carregando...',
        height: 700,
        transform: transformData,
        beforeLoad: beforeLoad,
        onError: function () {
            _loadingModal.modal('hide');
        }
    });

    function beforeLoad() {
        _loadingModal.modal('hide');
    }

    function transformData(pageData) {

        console.info('pageData', pageData);
    
        return pageData.map(function (employee) {
            return {    
                employeeId: employee.id,
                checkbox: false,
                employeeName: employee.name,
                role: employee.role.name
            }
        });
    }
};

function getFilters() {
    return filters = {
        subsidiaryId: $('#subsidiary-filter').data('value'),
        roleId: $('#role-filter').data('value'),
        employeeName: $('#employee-filter').val()
    };
}

function applyFilters() {
    loadEmployees(getFilters());
}

function clearFilters() {
    $('#filter-container').find('input').each(function () {
        const _element = $(this);
        _element.val('');
    });
}

function openDefaultRole() {
    get({  
        restlet: ROLE_URL_RESTLET,
        onSuccess: function (data) {
            window.open(data.url)
        },
        onError: function (errorMessage) {
            $.modal({
                type: 'alert',
                title: '<i class="fa fa-exclamation-triangle text-danger"></i>Atenção!',
                message: errorMessage
            });
        }
    });
}

function showConfirmActionDialog() {
    const _selectedEmployees = $(EMPLOYEES_TABLE_ID).selectedRows();

    if (!_selectedEmployees.length) {
        showAlertDialog();
        return;
    }

    $.modal({
        type: 'html',
        title: '<h4><i class="fa fa-pen text-info"></i>Executar rateio</h4>',
        html: $('#confirm-modal-template').html(),
        buttons: {
            cancel: {
                text: '<i class="fa fa-times text-danger"></i>Cancelar',
                isCloser: true,
            },
            confirm: {
                text: '<i id="1" class="fa fa-check text-success"></i>Confirmar',
                isCloser: true,
                action: function () {
                    applyGlobalPermissionsToSelectedEmployees(_selectedEmployees);
                }
            }
        },
        ready: function (modal) {   
            manageAutocompleteElements(modal);
        }
    });
};

function showAlertDialog() {
    $.modal({
        type: 'alert',
        title: '<i class="fa fa-exclamation-triangle text-danger"></i>Atenção!',
        message: 'Selecione pelo menos um funcionário'
    });
}

function applyGlobalPermissionsToSelectedEmployees(selectedEmployees) {

    const _transferLoading = loading('Atualizando funcionários selecionados');
    
    post({  
        restlet: UPDATE_EMPLOYEE_RESTLET,
        data: { 
            employeeList: selectedEmployees
        },
        onSuccess: function () {
            $.modal({
                type: 'alert',
                title: '<i class="fa fa-check text-success"></i>Sucesso!',
                message: 'Funcionários atualizados com sucesso!'
            });
        },
        onError: function (errorMessage) {
            $.modal({
                type: 'alert',
                title: '<i class="fa fa-exclamation-triangle text-danger"></i>Atenção!',
                message: errorMessage
            });
        },
        onComplete: function () {
            _transferLoading.modal('hide');
        }
    });
}


