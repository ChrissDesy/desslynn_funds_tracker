import * as engine from './apiEngine.js';


// get statistics
async function tranStatistics(){

    let data = await engine.getTransactionsStatistics();
    
    // monthly stats
    let exu = 0, exz = 0, inu = 0, inz = 0;    

    if(data.totals){

        data.totals.forEach(r => {
            if(r.currency == 'USD'){
                r.type == 'EX' ? exu = r.amt ? r.amt : 0 : inu = r.amt ? r.amt : 0;
            }
            else if(r.currency == 'ZWG'){
                r.type == 'EX' ? exz = r.amt ? r.amt : 0 : inz = r.amt ? r.amt : 0;
            }
        });

        let usdhtml = `<span class="text-success">${inu}</span> / <span class="text-danger">${exu}</span>`;
        let zwghtml = `<span class="text-success">${inz}</span> / <span class="text-danger">${exz}</span>`;

        $('#statUSD').html(usdhtml);
        $('#statZWG').html(zwghtml);
    }

    if(data.expenses){
        data.expenses.forEach(r => {
            $(`#expa${r.currency}`).html(r.amt);
            $(`#expt${r.currency}`).html(r.name ? r.name : '.');
        });
    }

}

$(function(){

    tranStatistics();

});