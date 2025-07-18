// -- IMPORTS

import { SupabaseRepository } from './supabase_repository.js';

// -- CONSTANTS

const TEST_TABLE = 'MESSAGE';

// -- TYPES

// -- VARIABLES

let supabaseRepository;

// -- FUNCTIONS

function setupTest()
{
    supabaseRepository = new SupabaseRepository();
}

function testComplexUpdateQuery()
{
    console.log( 'Testing complex update query...' );

    let filters = {
        where: {
            AND: [
                { key: { path: ['remoteJid'], equals: 'test@whatsapp.com' } },
                { key: { path: ['fromMe'], equals: false } },
                { messageTimestamp: { lte: 1234567890 } },
                { OR: [{ status: null }, { status: 'pending' }] },
            ],
        },
        data: { status: 'delivered' },
    };

    try
    {
        let result = supabaseRepository.update( TEST_TABLE, filters, { status: 'delivered' } );
        console.log( '✅ Complex update query test passed' );
        return true;
    }
    catch ( error )
    {
        console.error( '❌ Complex update query test failed:', error.message );
        return false;
    }
}

function testSimpleUpdateQuery()
{
    console.log( 'Testing simple update query...' );

    let filters = {
        id: 1,
        status: 'pending'
    };

    try
    {
        let result = supabaseRepository.update( TEST_TABLE, filters, { status: 'delivered' } );
        console.log( '✅ Simple update query test passed' );
        return true;
    }
    catch ( error )
    {
        console.error( '❌ Simple update query test failed:', error.message );
        return false;
    }
}

function testArrayUpdateQuery()
{
    console.log( 'Testing array update query...' );

    let filters = {
        id: [1, 2, 3],
        status: 'pending'
    };

    try
    {
        let result = supabaseRepository.update( TEST_TABLE, filters, { status: 'delivered' } );
        console.log( '✅ Array update query test passed' );
        return true;
    }
    catch ( error )
    {
        console.error( '❌ Array update query test failed:', error.message );
        return false;
    }
}

// -- STATEMENTS

setupTest();

console.log( '🧪 Running SupabaseRepository tests...\n' );

let tests = [
    testSimpleUpdateQuery,
    testArrayUpdateQuery,
    testComplexUpdateQuery
];

let passedTests = 0;
let totalTests = tests.length;

for ( let test of tests )
{
    if ( test() )
    {
        passedTests++;
    }
}

console.log( `\n📊 Test Results: ${ passedTests }/${ totalTests } tests passed` );

if ( passedTests === totalTests )
{
    console.log( '🎉 All tests passed!' );
}
else
{
    console.log( '⚠️  Some tests failed. Please check the implementation.' );
} 