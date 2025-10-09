import * as engine from './apiEngine.js';


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
                                <button class="dropdown-item text-warning pt-0 pb-0 iupdate">
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

    $("button.iupdate").click(function(e) {
        console.log(e.data);
        
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
                                <span class="dropdown-item text-warning pt-0 pb-0">
                                    <i class="fas fa-edit"></i> Update
                                </span>
                                <hr />
                                <span class="dropdown-item text-danger pt-0 pb-0">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </span>
                            </div>
                        </div>                
                    </td>
                </tr>
            `;

        });
    }

    $('#tBodyExpenses').html(tdata);

}


$(function(){
    
    getIncomeTypes();

    $("#incomeAdd").submit(async function(e) {
        e.preventDefault();
        await createNewIncomeType();
    });

});
