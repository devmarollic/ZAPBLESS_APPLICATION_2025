// Dados dos planos baseados no plan.bd
const plans = [
    {
        id: 'basic',
        name: 'Iniciante',
        description: 'Perfeito para igrejas pequenas',
        monthlyPrice: 99.9,
        annualPrice: 85
    },
    {
        id: 'growth', 
        name: 'Crescimento',
        description: 'Ideal para igrejas em expansão',
        monthlyPrice: 149.9,
        annualPrice: 127.5
    },
    {
        id: 'community',
        name: 'Comunidade', 
        description: 'Para igrejas grandes e estabelecidas',
        monthlyPrice: 199.9,
        annualPrice: 170
    }
];

// Função para criar assinatura de um plano
function createSubscriptionPlan(plan, isMonthly = true) {
    const price = isMonthly ? plan.monthlyPrice : plan.annualPrice;
    const priceInCents = Math.round(price * 100);
    const intervalType = isMonthly ? 'month' : 'year';
    const planSuffix = isMonthly ? 'mensal' : 'anual';
    
    const body = JSON.stringify({
        "interval": intervalType,
        "interval_count": 1,
        "pricing_scheme": {
            "scheme_type": "Unit",
            "price": priceInCents,
            "minimum_price": priceInCents
        },
        "quantity": null,
        "name": `${plan.name} ${planSuffix}`,
        "description": plan.description,
        "shippable": false,
        "payment_methods": [
            "credit_card",
            "boleto",
            "debit_card"
        ],
        "currency": "BRL",
        "minimum_price": priceInCents,
        "statement_descriptor": `ZapBless ${plan.name.toLowerCase()}`,
        "trial_period_days": 14,
        "quantity": 1
    });

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from("sk_test_7d446c4af5f94b40944961d1bf03ceae:").toString('base64'),
            'Content-Type': 'application/json'
        },
        body
    };

    const baseUrl = 'https://api.pagar.me/core/v5';
    
    return fetch(baseUrl + '/subscriptions', options)
        .then(res => res.json())
        .then((data) => {
            console.log(`Plano ${plan.name} ${planSuffix} criado:`, data);
            return data;
        })
        .catch((error) => {
            console.error(`Erro ao criar plano ${plan.name} ${planSuffix}:`, error);
            return error;
        });
}

// Criar assinaturas para todos os planos (mensais e anuais)
async function createAllSubscriptions() {
    console.log('Iniciando criação de assinaturas na Pagar.me...');
    
    for (const plan of plans) {
        console.log(`\nCriando assinaturas para o plano: ${plan.name}`);
        
        // Criar plano mensal
        await createSubscriptionPlan(plan, true);
        
        // Aguardar um pouco antes de criar o próximo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Criar plano anual
        await createSubscriptionPlan(plan, false);
        
        // Aguardar um pouco antes do próximo plano
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\nTodas as assinaturas foram processadas!');
}

// Função para listar todas as assinaturas
async function listAllSubscriptions() {
    console.log('Listando todas as assinaturas da Pagar.me...\n');
    
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from("sk_test_7d446c4af5f94b40944961d1bf03ceae:").toString('base64'),
            'Content-Type': 'application/json'
        }
    };

    const baseUrl = 'https://api.pagar.me/core/v5';
    
    try {
        const response = await fetch(baseUrl + '/subscriptions', options);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            console.log(`Total de assinaturas encontradas: ${data.data.length}\n`);
            
            data.data.forEach((subscription, index) => {
                console.log(`--- Assinatura ${index + 1} ---`);
                console.log(`ID: ${subscription.id}`);
                console.log(`Nome: ${subscription.plan?.name || 'N/A'}`);
                console.log(`Descrição: ${subscription.plan?.description || 'N/A'}`);
                console.log(`Status: ${subscription.status}`);
                console.log(`Intervalo: ${subscription.plan?.interval}`);
                console.log(`Preço: R$ ${(subscription.plan?.amount / 100).toFixed(2)}`);
                console.log(`Criado em: ${new Date(subscription.created_at).toLocaleDateString('pt-BR')}`);
                console.log(`Cliente: ${subscription.customer?.name || 'N/A'}`);
                console.log('');
            });
            
            // Mostrar paginação se houver
            if (data.paging) {
                console.log(`--- Paginação ---`);
                console.log(`Total: ${data.paging.total}`);
                console.log(`Página atual: ${data.paging.current_page}`);
                console.log(`Total de páginas: ${data.paging.total_pages}`);
            }
        } else {
            console.log('Nenhuma assinatura encontrada.');
        }
        
        return data;
        
    } catch (error) {
        console.error('Erro ao listar assinaturas:', error);
        return error;
    }
}

// Função para listar assinaturas com filtros
async function listSubscriptionsWithFilters(status = null, page = 1, size = 25) {
    console.log('Listando assinaturas com filtros...\n');
    
    let url = `https://api.pagar.me/core/v5/subscriptions?page=${page}&size=${size}`;
    
    if (status) {
        url += `&status=${status}`;
    }
    
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from("sk_test_7d446c4af5f94b40944961d1bf03ceae:").toString('base64'),
            'Content-Type': 'application/json'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`Filtros aplicados: Status=${status || 'todos'}, Página=${page}, Tamanho=${size}\n`);
        
        if (data.data && data.data.length > 0) {
            console.log(`Assinaturas encontradas: ${data.data.length}\n`);
            
            data.data.forEach((subscription, index) => {
                console.log(`${index + 1}. ${subscription.plan?.name || 'Sem nome'} - Status: ${subscription.status} - R$ ${(subscription.plan?.amount / 100).toFixed(2)}`);
            });
        } else {
            console.log('Nenhuma assinatura encontrada com os filtros aplicados.');
        }
        
        return data;
        
    } catch (error) {
        console.error('Erro ao listar assinaturas com filtros:', error);
        return error;
    }
}

// Exemplos de uso das funções:
// Descomente a linha abaixo para executar a listagem
// listAllSubscriptions();

// Exemplos com filtros:
// listSubscriptionsWithFilters('active'); // Apenas assinaturas ativas
// listSubscriptionsWithFilters('canceled'); // Apenas assinaturas canceladas
// listSubscriptionsWithFilters(null, 1, 10); // Primeira página com 10 itens

// Executar a criação das assinaturas
createAllSubscriptions();
