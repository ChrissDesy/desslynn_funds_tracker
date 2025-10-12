import * as engine from './apiEngine.js';

let pageSize = 5, page = 0;
let incomeTypes, expenseTypes;

// get transactions
async function getAllTransations(){

    let resp = await engine.getAllTransactions(page, pageSize);
    
    let tdata = '';
    let data = resp.data;

    if(data){
        data.forEach(r => {
            
            tdata += `
                <tr class="${r.type == 'IN' ? 'text-success' : 'text-danger'}">
                    <th>${r.id}</th>
                    <td>${r.datecreated}</td>
                    <td>${r.currency}</td>
                    <th>$${r.amount}</th>
                    <td>
                        <span class="text-primary pointer btnInfo" data-ref="${r.type}/${r.id}">
                            <i class="fas fa-eye"></i>
                        </span>
                    </td>
                </tr>
            `;

        });
    }

    $('#tBodyTrans').html(tdata);
    
    $("span.btnInfo").click(async function(e) {
        let ref = $(e.currentTarget).attr('data-ref');

        if(!ref){
            engine.showAlert('error', 'Reference not found.', 'Reference Error');
            return;
        }

        await getTransactionDetails(ref);
        
        return;
    });

    // pagination
    handlePagination(resp);

}

async function getTransactionDetails(ref){
    let txn = await engine.getTransactionDetails(ref);
    
    $('#txnRef').html(txn[0].id);
    $('#txnDate').html(txn[0].datecreated);
    $('#txnCat').html(txn[0].type);
    $('#txnTyp').html(txn[0].name + ' ('+txn[0].description+')');
    $('#txnCurr').html(txn[0].currency);
    $('#txnAmt').html('$' + txn[0].amount);
    $('#txnUser').html(txn[0].modifiedby);

    $('#txn-info').modal('show');
}

async function getIncomeTypes(){
    
    let data = await engine.getAllIncomeTypes();    
    
    if(!data || data.length == 0){
        engine.showAlert('error', 'No income types defined.', 'Income Types');
        return;
    }

    incomeTypes = data;
}

async function getExpenseTypes(){
    
    let data = await engine.getAllExpenseTypes();    
    
    if(!data || data.length == 0){
        engine.showAlert('error', 'No expense types defined.', 'Expense Types');
        return;
    }

    expenseTypes = data;
}

function handleCategorySelection(mode){
    let tdata = '<option value="" selected disabled>choose...</option>';

    let data = (mode == 'IN') ? incomeTypes : expenseTypes;

    if(data){
        data.forEach(r => {
            tdata += `<option value="${r.id}">${r.name} (${r.description})</option>`
        });
    }

    $('select#type').html(tdata);
}

async function createNewTransaction(){
    let typ = $('#category').val();
    let ref = $('#type').val();
    let curr = $('#currency').val();
    let amt = $('#amount').val();
    
    if(!typ){
        $('#category').addClass('is-invalid');
        return;
    }
    else{
        $('#category').removeClass('is-invalid');
    }

    if(!ref){
        $('#type').addClass('is-invalid');
        return;
    }
    else{
        $('#type').removeClass('is-invalid');
    }

    if(!curr){
        $('#currency').addClass('is-invalid');
        return;
    }
    else{
        $('#currency').removeClass('is-invalid');
    }

    if(!amt){
        $('#amount').addClass('is-invalid');
        return;
    }
    else{
        $('#amount').removeClass('is-invalid');
    }

    let data = {
        type: typ,
        typeref: ref,
        currency: curr,
        amount: amt
    };

    await engine.createTransaction(data).then(
        resp => {
            console.log(resp);

            if(resp == 400){
                engine.showAlert('error', 'Something wrong with your data : 400', 'Request Failed')
                return;
            }

            engine.showAlert('success', 'New Transaction Created.', 'Request Success');

            getAllTransations();

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


// pagination
function handlePagination(data){

    // counter
    let showin = ((page + 1) * pageSize > data.total_items) ? data.total_items : (page + 1) * pageSize;
    $('#entriesCounter').html(`Showing ${showin} of ${data.total_items} items.`);

    // pages
    $('#entriesPages').html(`${page + 1} / ${data.total_pages}`);

    // navigation
    (page == 0) ? $('button#entriesPrev').attr('disabled', true) : $('button#entriesPrev').attr('disabled', false);
    (showin == data.total_items) ? $('button#entriesNxt').attr('disabled', true) : $('button#entriesNxt').attr('disabled', false);

}

$(function(){
    
    getAllTransations();
    
    $("button.txnAdd").click(function() {
        
        if(!incomeTypes) getIncomeTypes();
        if(!expenseTypes) getExpenseTypes();

        return;
    });
    
    $("select#category").on('change', function(e){
        
        let mode = e.target.value;

        if(!mode){
            engine.showAlert('warn','Invalid category: ' + mode, 'Unknown Category');
            return;
        }

        handleCategorySelection(mode);
    });

    $("#txnAdd").submit(async function(e) {
        e.preventDefault();
        await createNewTransaction();
    });

    // pagination
    $("select#entriesItem").on('change', function(e){
        
        let val = e.target.value;

        if(!val){
            engine.showAlert('warn','Invalid item value: ' + val, 'Unknown Value');
            return;
        }

        pageSize = val;
        page = 0;

        getAllTransations();
        
    });

    $("button#entriesNxt").click(function() {
        
        page += 1;

        getAllTransations();

    });

    $("button#entriesPrev").click(function() {
        
        page -= 1;

        getAllTransations();

    });

});
