const pagarme = require('pagarme');

fetch('https://api.pagar.me/core/v5/orders',
    {
    method: 'POST',             
    headers: {               
        'Authorization': 'Basic ' + Buffer.from("pk_test_lrM5QPwi19iRdyjv:").toString('base64'),
        'Content-Type': 'application/json'              
      },
      body: {
        "email": "pk_test_lrM5QPwi19iRdyjv",
        "password": ""
      }
    }
).then( res => res.json()).then( data => console.log( data ))

// (async () => {
//     const client = await pagarme.client.connect({
//         api_key: 'pk_test_lrM5QPwi19iRdyjv',
//     });

//     await client.plans.create({
//         amount: 9990,
//         days: 30,
//         name: 'Iniciante Mensal',
//         payment_methods: ['credit_card', 'boleto', 'pix']
//     });

//     await client.plans.create({
//         amount: 14990,
//         days: 30,
//         name: 'Crescimento Mensal',
//         payment_methods: ['credit_card', 'boleto', 'pix']
//     });

//     await client.plans.create({
//         amount: 19990,
//         days: 30,
//         name: 'Comunidade Mensal',
//         payment_methods: ['credit_card', 'boleto', 'pix']
//     });


//     await client.plans.create({
//         amount: 102000,
//         days: 365,
//         name: 'Iniciante Anual',
//         payment_methods: ['credit_card', 'boleto', 'pix']
//     });

//     await client.plans.create({
//         amount: 153000,
//         days: 365,
//         name: 'Crescimento Anual',
//         payment_methods: ['credit_card', 'boleto', 'pix']
//     });

//     await client.plans.create({
//         amount: 204000,
//         days: 365,
//         name: 'Comunidade Anual',
//         payment_methods: ['credit_card', 'boleto', 'pix']
//     });

// })();