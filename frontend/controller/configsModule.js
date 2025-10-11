import * as engine from './apiEngine.js';

// get statistics
async function configStatistics(){

    let data = await engine.getConfigsStatistics();
    
    // console.log(data);
    
    $('#incomeTypes').html(data[0].incometypes);
    $('#expenseTypes').html(data[0].expensetypes);

}

// get running balances
async function getRunningBalances(){

    let data = await engine.getAccountBalances();
    
    let tdata = '';

    if(data){
        data.forEach(r => {
            
            tdata += `
                <tr>
                    <th>${r.id}</th>
                    <th>${r.currency}</th>
                    <th>$${r.balance}</th>
                    <td>${r.lastledgerref}</td>
                    <td>${r.datemodified}</td>
                    <td>${r.modifiedby}</td>
                </tr>
            `;

        });
    }

    $('#tBodyAccounts').html(tdata);

}

// manage income types
async function getIncomeTypes(){
    
    let data = await engine.getAllIncomeTypes();    
    
    let tdata = '';

    if(data){
        data.forEach(r => {
            
            tdata += `
                <tr>
                    <th>${r.id}</th>
                    <th>${r.name}</th>
                    <td>${r.description}</td>
                    <td>
                        <div class="dropdown sub-dropdown">
                            <button class="btn btn-link text-muted dropdown-toggle p-0" type="button"
                                id="dd1" data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dd1">
                                <button class="dropdown-item text-warning pt-0 pb-0 iupdate" data-ref="${r.id}">
                                    <i class="fas fa-edit"></i> Update
                                </button>
                                <hr />
                                <button class="dropdown-item text-danger pt-0 pb-0 idelete" data-ref="${r.id}">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        </div>                
                    </td>
                </tr>
            `;

        });
    }

    $('#tBodyIncomes').html(tdata);
    
    $("button.idelete").click(async function(e) {
        let ref = $(e.currentTarget).attr('data-ref');

        if(!ref){
            engine.showAlert('error', 'Reference not found.', 'Reference Error');
            return;
        }

        await deleteIncomeType(ref);
        
        return;
    });

    $("button.iupdate").click(async function(e) {
        let ref = $(e.currentTarget).attr('data-ref');

        if(!ref){
            engine.showAlert('error', 'Reference not found.', 'Reference Error');
            return;
        }

        let typ = await engine.getIncomeTypeByRef(ref);
        
        if(!typ){
            engine.showAlert('error', 'Type not found.', 'Reference Error');
            return;
        }

        $('#ref2').val(typ.id);
        $('#name2').val(typ.name);
        $('#description2').val(typ.description);

        $('#income-edit').modal('show');

        $("#incomeUpdate").submit(async function(e) {
            e.preventDefault();
            await updateIncomeType();
        });
        
        return;
    });
}

async function createNewIncomeType(){
    let name = $('#name1').val();
    let desc = $('#description1').val();
    

    if(!name){
        $('#name1').addClass('is-invalid');
        return;
    }
    else{
        $('#name1').removeClass('is-invalid');
    }

    if(!desc){
        $('#description1').addClass('is-invalid');
        return;
    }
    else{
        $('#description1').removeClass('is-invalid');
    }

    let data = {
        name: name,
        description: desc
    };

    await engine.createIncomeType(data).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Income Type Created.', 'Request Success');

            getIncomeTypes();

            return false;
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );

    return false;
}

async function deleteIncomeType(ref){
    await engine.deleteIncomeType(ref).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Income Type Deleted.', 'Request Success');

            getIncomeTypes();

            return false;
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );
}

async function updateIncomeType(){
    let ref = $('#ref2').val();
    let name = $('#name2').val();
    let desc = $('#description2').val();
    

    if(!name){
        $('#name2').addClass('is-invalid');
        return;
    }
    else{
        $('#name2').removeClass('is-invalid');
    }

    if(!desc){
        $('#description2').addClass('is-invalid');
        return;
    }
    else{
        $('#description2').removeClass('is-invalid');
    }

    let data = {
        name: name,
        description: desc,
        id: ref
    };

    await engine.updateIncomeType(data).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Income Type Updated.', 'Request Success');

            getIncomeTypes();

            return false;
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );

    return false;
}

// manage expense types
async function getExpenseTypes(){
    
    let data = await engine.getAllExpenseTypes();    
    
    let tdata = '';

    if(data){
        data.forEach(r => {
            
            tdata += `
                <tr>
                    <th>${r.id}</th>
                    <th>${r.name}</th>
                    <td>${r.description}</td>
                    <td>
                        <div class="dropdown sub-dropdown">
                            <button class="btn btn-link text-muted dropdown-toggle p-0" type="button"
                                id="dd1" data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dd1">
                                <button class="dropdown-item text-warning pt-0 pb-0 eupdate" data-ref="${r.id}">
                                    <i class="fas fa-edit"></i> Update
                                </button>
                                <hr />
                                <button class="dropdown-item text-danger pt-0 pb-0 edelete" data-ref="${r.id}">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        </div>                
                    </td>
                </tr>
            `;

        });
    }

    $('#tBodyExpenses').html(tdata);

    $("button.edelete").click(async function(e) {
        let ref = $(e.currentTarget).attr('data-ref');

        if(!ref){
            engine.showAlert('error', 'Reference not found.', 'Reference Error');
            return;
        }

        await deleteExpenseType(ref);
        
        return;
    });

    $("button.eupdate").click(async function(e) {
        let ref = $(e.currentTarget).attr('data-ref');

        if(!ref){
            engine.showAlert('error', 'Reference not found.', 'Reference Error');
            return;
        }

        let typ = await engine.getExpenseTypeByRef(ref);
        
        if(!typ){
            engine.showAlert('error', 'Type not found.', 'Reference Error');
            return;
        }

        $('#ref4').val(typ.id);
        $('#name4').val(typ.name);
        $('#description4').val(typ.description);

        $('#expense-edit').modal('show');

        $("#expenseUpdate").submit(async function(e) {
            e.preventDefault();
            await updateExpenseType();
        });
        
        return;
    });

}

async function createNewExpenseType(){
    let name = $('#name3').val();
    let desc = $('#description3').val();
    

    if(!name){
        $('#name3').addClass('is-invalid');
        return;
    }
    else{
        $('#name3').removeClass('is-invalid');
    }

    if(!desc){
        $('#description3').addClass('is-invalid');
        return;
    }
    else{
        $('#description3').removeClass('is-invalid');
    }

    let data = {
        name: name,
        description: desc
    };

    await engine.createExpenseType(data).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Expense Type Created.', 'Request Success');

            getExpenseTypes();

            return false;
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );

    return false;
}

async function deleteExpenseType(ref){
    await engine.deleteExpenseType(ref).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Expense Type Deleted.', 'Request Success');

            getExpenseTypes();

            return false;
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );
}

async function updateExpenseType(){
    let ref = $('#ref4').val();
    let name = $('#name4').val();
    let desc = $('#description4').val();
    

    if(!name){
        $('#name4').addClass('is-invalid');
        return;
    }
    else{
        $('#name4').removeClass('is-invalid');
    }

    if(!desc){
        $('#description4').addClass('is-invalid');
        return;
    }
    else{
        $('#description4').removeClass('is-invalid');
    }

    let data = {
        name: name,
        description: desc,
        id: ref
    };

    await engine.updateExpenseType(data).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'Expense Type Updated.', 'Request Success');

            getIncomeTypes();

            return false;
        }        
    ).catch(
        err => {
            console.error(err);
            engine.showAlert('error', err?.statusText + ': ' + err.status, 'Request Failed');

            return false;
        }
    );

    return false;
}


$(function(){
    
    configStatistics();

    getIncomeTypes();

    getExpenseTypes();

    getRunningBalances();

    $("#incomeAdd").submit(async function(e) {
        e.preventDefault();
        await createNewIncomeType();
    });

    $("#expenseAdd").submit(async function(e) {
        e.preventDefault();
        await createNewExpenseType();
    });

});
