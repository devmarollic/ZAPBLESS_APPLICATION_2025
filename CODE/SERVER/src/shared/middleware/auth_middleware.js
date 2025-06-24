// -- IMPORTS

import { createLogger } from '../../utils/logger.js';
import { AppError } from '../errors/app_error.js';
import { getSupabaseClient } from '../../config/auth/index.js';

// -- CONSTANTS

const PUBLIC_ROUTES = [
    '/health',
    '/api',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/plan/list'
];

const ADMIN_ONLY_ROUTES = [
    '/api/church/create',
    '/api/church/delete',
    '/api/plan/create',
    '/api/plan/update',
    '/api/plan/delete'
];

// -- VARIABLES

const logger = createLogger( 'AUTH_MIDDLEWARE' );

// -- FUNCTIONS

function isPublicRoute( url )
{
    return PUBLIC_ROUTES.some( route => {
        if ( route.endsWith( '*' ) )
        {
            return url.startsWith( route.slice( 0, -1 ) );
        }
        
        return url === route || url.startsWith( `${route}/` );
    });
}

function isAdminOnlyRoute( url )
{
    return ADMIN_ONLY_ROUTES.some( route => {
        if ( route.endsWith( '*' ) )
        {
            return url.startsWith( route.slice( 0, -1 ) );
        }
        
        return url === route || url.startsWith( `${route}/` );
    });
}

async function authMiddleware( request, reply )
{
    try
    {
        const authHeader = request.headers.authorization;
        
        if ( !authHeader )
        {
            throw AppError.unauthorized( 'Token de acesso é obrigatório' );
        }
        
        if ( !authHeader.startsWith( 'Bearer ' ) )
        {
            throw AppError.unauthorized( 'Formato do token inválido. Use: Bearer <token>' );
        }
        
        const token = authHeader.substring( 7 );
        
        if ( !token )
        {
            throw AppError.unauthorized( 'Token não fornecido' );
        }
        
        logger.debug( 'Verifying token' );
        
        const supabase = getSupabaseClient();
        
        // Verify the JWT token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser( token );
        
        if ( error )
        {
            logger.warn( 'Token verification failed', { error: error.message } );
            
            if ( error.message.includes( 'JWT expired' ) )
            {
                throw AppError.unauthorized( 'Token expirado' );
            }
            
            if ( error.message.includes( 'invalid JWT' ) )
            {
                throw AppError.unauthorized( 'Token inválido' );
            }
            
            throw AppError.unauthorized( 'Falha na verificação do token' );
        }
        
        if ( !user )
        {
            throw AppError.unauthorized( 'Usuário não encontrado' );
        }
        
        // Attach user information to request
        request.user = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
            churchId: user.user_metadata?.church_id,
            role: user.user_metadata?.role || 'member',
            emailConfirmed: !!user.email_confirmed_at,
            createdAt: user.created_at,
            lastSignInAt: user.last_sign_in_at
        };
        
        logger.debug( 'Token verified successfully', { 
            userId: user.id,
            email: user.email,
            role: request.user.role
        });
    }
    catch ( error )
    {
        if ( error instanceof AppError )
        {
            throw error;
        }
        
        logger.logError( error, 'Authentication middleware' );
        throw AppError.unauthorized( 'Erro na autenticação' );
    }
}

async function adminMiddleware( request, reply )
{
    // First run auth middleware
    await authMiddleware( request, reply );
    
    // Check if user has admin role
    if ( request.user?.role !== 'admin' )
    {
        logger.warn( 'Admin access denied', { 
            userId: request.user?.id,
            role: request.user?.role
        });
        
        throw AppError.forbidden( 'Acesso restrito a administradores' );
    }
    
    logger.debug( 'Admin access granted', { userId: request.user.id } );
}

async function churchAdminMiddleware( request, reply )
{
    // First run auth middleware
    await authMiddleware( request, reply );
    
    // Check if user has church admin or higher role
    const allowedRoles = ['admin', 'church_admin'];
    
    if ( !allowedRoles.includes( request.user?.role ) )
    {
        logger.warn( 'Church admin access denied', { 
            userId: request.user?.id,
            role: request.user?.role
        });
        
        throw AppError.forbidden( 'Acesso restrito a administradores da igreja' );
    }
    
    logger.debug( 'Church admin access granted', { 
        userId: request.user.id,
        role: request.user.role
    });
}

// Optional middleware - doesn't throw if token is missing
async function optionalAuthMiddleware( request, reply )
{
    try
    {
        const authHeader = request.headers.authorization;
        
        if ( !authHeader || !authHeader.startsWith( 'Bearer ' ) )
        {
            request.user = null;
            return;
        }
        
        const token = authHeader.substring( 7 );
        
        if ( !token )
        {
            request.user = null;
            return;
        }
        
        const supabase = getSupabaseClient();
        
        const { data: { user }, error } = await supabase.auth.getUser( token );
        
        if ( error || !user )
        {
            request.user = null;
            return;
        }
        
        request.user = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
            churchId: user.user_metadata?.church_id,
            role: user.user_metadata?.role || 'member',
            emailConfirmed: !!user.email_confirmed_at,
            createdAt: user.created_at,
            lastSignInAt: user.last_sign_in_at
        };
        
        logger.debug( 'Optional auth successful', { userId: user.id } );
    }
    catch ( error )
    {
        logger.debug( 'Optional auth failed, continuing without user', { 
            error: error.message 
        });
        request.user = null;
    }
}

function requireRole( ...allowedRoles )
{
    return async function roleMiddleware( request, reply )
    {
        if ( !request.user )
        {
            throw AppError.unauthorized( 'Authentication required' );
        }
        
        const userRole = request.user.role;
        
        if ( !allowedRoles.includes( userRole ) )
        {
            throw AppError.forbidden( 
                `Access denied. Required roles: ${allowedRoles.join( ', ' )}. Your role: ${userRole}` 
            );
        }
    };
}

function requirePermission( permission )
{
    return async function permissionMiddleware( request, reply )
    {
        if ( !request.user )
        {
            throw AppError.unauthorized( 'Authentication required' );
        }
        
        const userPermissions = request.user.permissions || [];
        
        if ( !userPermissions.includes( permission ) )
        {
            throw AppError.forbidden( `Missing required permission: ${permission}` );
        }
    };
}

function requireChurchAccess( request, reply )
{
    if ( !request.user )
    {
        throw AppError.unauthorized( 'Authentication required' );
    }
    
    if ( !request.user.churchId )
    {
        throw AppError.forbidden( 'Church membership required' );
    }
    
    // For routes that access specific church resources, ensure user belongs to that church
    const requestedChurchId = request.params.churchId || request.body?.churchId;
    
    if ( requestedChurchId && requestedChurchId !== request.user.churchId )
    {
        // Allow superadmins to access any church
        if ( request.user.role !== 'superadmin' )
        {
            throw AppError.forbidden( 'Access denied to this church resource' );
        }
    }
}

// -- STATEMENTS

export { 
    authMiddleware, 
    adminMiddleware, 
    churchAdminMiddleware, 
    optionalAuthMiddleware,
    requireRole,
    requirePermission,
    requireChurchAccess,
    isPublicRoute,
    isAdminOnlyRoute
}; 