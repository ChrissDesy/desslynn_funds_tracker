
let baseURL = 'http://127.0.0.1:5000/';
// let baseURL = 'https://desslynn-funds-tracker.onrender.com/';

// alerts
export function showAlert(typ, msg, title){
    
    if(typ == 'success')
        toastr.success(msg, title, {positionClass: "toast-bottom-center"});
    else if(typ == 'warn')
        toastr.warning(msg, title, {positionClass: "toast-bottom-center"});
    else if(typ == 'error')
        toastr.error(msg, title, {positionClass: "toast-bottom-center"});
    else if(typ == 'info')
        toastr.info(msg, title, {positionClass: "toast-bottom-center"});

}

// shared ajax request
async function makeAjaxRequest(url, method, data){

    let apiResp;

    await $.ajax({
        url: `${baseURL}${url}`,
        method: method,
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : '',
        success: function(resp){
            // console.log(resp);
            apiResp = resp;
        },
        error: function(err){
            console.log(err);
            showAlert('error', `${err.statusText}: ${err.status}`);
            return null;
        }
    });

    return apiResp;

}

// get account balances
export async function getAccountBalances(){
    
    let resp = await makeAjaxRequest('account/balances', 'GET');

    // console.log(resp);
    return resp;

}

// transactions
async function getTransactionsByType(typ, page, size){
    
    if(!typ || !page || !size)
        return 400;

    let resp = await makeAjaxRequest(`transactions/by-type/${typ}/${page}/${size}`, 'GET');

    // console.log(resp);
    return resp;

}

async function getTransactionsByCurrency(curr, page, size){
    
    if(!curr || !page || !size)
        return 400;

    let resp = await makeAjaxRequest(`transactions/by-currency/${curr}/${page}/${size}`, 'GET');

    // console.log(resp);
    return resp;

}

export async function getAllTransactions(page, size){
    
    if(page == undefined || !size)
        return 400;

    let resp = await makeAjaxRequest(`transactions/all/${page}/${size}`, 'GET');

    // console.log(resp);
    return resp;

}

export async function getTransactionDetails(ref){
    
    if(!ref)
        return 400;

    let resp = await makeAjaxRequest(`transactions/by-ref/${ref}`, 'GET');

    // console.log(resp);
    return resp;

}

export async function createTransaction(data){
    
    if(!data)
        return 400;

    let resp = await makeAjaxRequest(`account/transact`, 'POST', data);

    // console.log(resp);
    return resp;

}

// income types
export async function createIncomeType(data){
    
    if(!data)
        return 400;

    let resp = await makeAjaxRequest(`config/income`, 'POST', data);

    // console.log(resp);
    return resp;

}

export async function updateIncomeType(data){
    
    if(!data)
        return 400;

    let resp = await makeAjaxRequest(`config/income`, 'PUT', data);

    // console.log(resp);
    return resp;

}

export async function getAllIncomeTypes(){
    
    let resp = await makeAjaxRequest(`config/income`, 'GET');

    // console.log(resp);
    return resp;

}

export async function getIncomeTypeByRef(ref){
    
    if(!ref)
        return 400;

    let resp = await makeAjaxRequest(`config/income/${ref}`, 'GET');

    // console.log(resp);
    return resp;

}

export async function deleteIncomeType(ref){
    
    if(!ref)
        return 400;

    let resp = await makeAjaxRequest(`config/income/delete/${ref}`, 'DELETE');

    // console.log(resp);
    return resp;

}

// expense types
export async function createExpenseType(data){
    
    if(!data)
        return 400;

    let resp = await makeAjaxRequest(`config/expense`, 'POST', data);

    // console.log(resp);
    return resp;

}

export async function updateExpenseType(data){
    
    if(!data)
        return 400;

    let resp = await makeAjaxRequest(`config/expense`, 'PUT', data);

    // console.log(resp);
    return resp;

}

export async function getAllExpenseTypes(){
    
    let resp = await makeAjaxRequest(`config/expense`, 'GET');

    // console.log(resp);
    return resp;

}

export async function getExpenseTypeByRef(ref){
    
    if(!ref)
        return 400;

    let resp = await makeAjaxRequest(`config/expense/${ref}`, 'GET');

    // console.log(resp);
    return resp;

}

export async function deleteExpenseType(ref){
    
    if(!ref)
        return 400;

    let resp = await makeAjaxRequest(`config/expense/delete/${ref}`, 'DELETE');

    // console.log(resp);
    return resp;

}


// get config statistics
export async function getConfigsStatistics(){
    
    let resp = await makeAjaxRequest(`configs/statistics`, 'GET');

    // console.log(resp);
    return resp;

}

// get tran statistics
export async function getTransactionsStatistics(){
    
    let resp = await makeAjaxRequest(`transactions/statistics`, 'GET');

    // console.log(resp);
    return resp;

}


