import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../utils/jwt';
import { UserRole, PermissionCheck } from '../types/auth';
import { ApiError, ApiErrorCode, ApiRequest } from '../types/api';
import { userService } from '../controllers/user.controller';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authorization header required'
      });
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyToken(token);
    
    const user = await userService.findById(payload.userId);
    if (!user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Invalid token'
      });
    }

    (req as ApiRequest).user = user;
    (req as ApiRequest).tokenPayload = payload;
    
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (
  ...allowedRoles: UserRole[]
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      return next(new ApiError({
        code: ApiErrorCode.AUTHENTICATION_ERROR,
        message: 'Authentication required'
      }));
    }

    if (!allowedRoles.includes(apiReq.user.role)) {
      return next(new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: 'Insufficient permissions'
      }));
    }

    next();
  };
};

export const checkPermission = (permission: PermissionCheck) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      return next(new ApiError({
        code: ApiErrorCode.AUTHENTICATION_ERROR,
        message: 'Authentication required'
      }));
    }

    const hasPermission = permissionService.checkUserPermission(
      apiReq.user,
      permission,
      req.params.id
    );

    if (!hasPermission) {
      return next(new ApiError({
        code: ApiErrorCode.AUTHORIZATION_ERROR,
        message: `Permission denied: ${permission.action} on ${permission.resource}`
      }));
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = jwtService.verifyToken(token);
      
      const user = await userService.findById(payload.userId);
      if (user) {
        (req as ApiRequest).user = user;
        (req as ApiRequest).tokenPayload = payload;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

class PermissionService {
  private readonly rolePermissions: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: [
      'users:*',
      'meetings:*',
      'scenarios:*',
      'analytics:*',
      'system:*'
    ],
    [UserRole.PRODUCT_MANAGER]: [
      'meetings:create',
      'meetings:read:own',
      'meetings:update:own',
      'meetings:delete:own',
      'scenarios:read',
      'scenarios:create:own',
      'analytics:read:own'
    ],
    [UserRole.EXECUTIVE]: [
      'meetings:create',
      'meetings:read:own',
      'meetings:read:team',
      'meetings:update:own',
      'meetings:delete:own',
      'scenarios:read',
      'scenarios:create:own',
      'analytics:read:own',
      'analytics:read:team'
    ],
    [UserRole.TEAM_LEAD]: [
      'meetings:create',
      'meetings:read:own',
      'meetings:read:team',
      'meetings:update:own',
      'meetings:delete:own',
      'scenarios:read',
      'scenarios:create:own',
      'analytics:read:own',
      'analytics:read:team'
    ],
    [UserRole.USER]: [
      'meetings:create',
      'meetings:read:own',
      'meetings:update:own',
      'meetings:delete:own',
      'scenarios:read',
      'scenarios:create:own',
      'analytics:read:own'
    ]
  };

  checkUserPermission(
    user: any,
    permission: PermissionCheck,
    resourceId?: string
  ): boolean {
    const userPermissions = this.rolePermissions[user.role as UserRole] || [];
    
    const fullPermission = `${permission.resource}:${permission.action}`;
    const wildcardPermission = `${permission.resource}:*`;
    const globalWildcard = 'system:*';

    if (userPermissions.includes(globalWildcard)) {
      return true;
    }

    if (userPermissions.includes(wildcardPermission)) {
      return true;
    }

    if (userPermissions.includes(fullPermission)) {
      return true;
    }

    if (permission.action === 'read' || permission.action === 'update' || permission.action === 'delete') {
      const ownPermission = `${permission.resource}:${permission.action}:own`;
      if (userPermissions.includes(ownPermission)) {
        return this.isOwnResource(user, permission.resource, resourceId);
      }

      const teamPermission = `${permission.resource}:${permission.action}:team`;
      if (userPermissions.includes(teamPermission)) {
        return this.isTeamResource(user, permission.resource, resourceId);
      }
    }

    return false;
  }

  private isOwnResource(_user: any, resource: string, resourceId?: string): boolean {
    if (!resourceId) return true;
    
    switch (resource) {
      case 'meetings':
      case 'scenarios':
      case 'analytics':
        return true;
      default:
        return false;
    }
  }

  private isTeamResource(_user: any, _resource: string, _resourceId?: string): boolean {
    return true;
  }
}

export const permissionService = new PermissionService();