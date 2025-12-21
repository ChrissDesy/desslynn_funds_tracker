import * as engine from './apiEngine.js';


// get statistics
async function tranStatistics(){

    let data = await engine.getTransactionsStatistics();
    
    // monthly stats
    let exu, exz, inu, inz;    

    if(data.totals){

        data.totals.forEach(r => {
            if(r.currency == 'USD'){
                r.type == 'EX' ? exu = r.amt : inu = r.amt;
            }
            else if(r.currency == 'ZWG'){
                r.type == 'EX' ? exz = r.amt : inz = r.amt;
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