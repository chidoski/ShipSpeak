import jwt from 'jsonwebtoken';
import { JWTPayload, User } from '../types/auth';
import { ApiError, ApiErrorCode } from '../types/api';

export class JWTService {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly tokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback-secret-key';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    this.tokenExpiry = process.env.JWT_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

    if (process.env.NODE_ENV === 'production' && this.secret === 'fallback-secret-key') {
      throw new Error('JWT_SECRET must be set in production');
    }
  }

  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.tokenExpiry,
      issuer: 'shipspeak-api',
      audience: 'shipspeak-client'
    } as any);
  }

  generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: 'refresh'
    };

    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'shipspeak-api',
      audience: 'shipspeak-client'
    } as any);
  }

  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: 'shipspeak-api',
        audience: 'shipspeak-client'
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError({
          code: ApiErrorCode.UNAUTHORIZED,
          message: 'Token has expired'
        });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError({
          code: ApiErrorCode.UNAUTHORIZED,
          message: 'Invalid token'
        });
      }

      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Invalid token'
      });
    }
  }

  verifyRefreshToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        issuer: 'shipspeak-api',
        audience: 'shipspeak-client'
      }) as any;

      if (decoded.type !== 'refresh') {
        throw new ApiError({
          code: ApiErrorCode.AUTHENTICATION_ERROR,
          message: 'Invalid refresh token type'
        });
      }

      return { userId: decoded.userId };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError({
          code: ApiErrorCode.AUTHENTICATION_ERROR,
          message: 'Refresh token has expired'
        });
      }

      throw new ApiError({
        code: ApiErrorCode.AUTHENTICATION_ERROR,
        message: 'Invalid refresh token'
      });
    }
  }

  getTokenExpiration(): Date {
    const duration = this.parseExpiry(this.tokenExpiry);
    return new Date(Date.now() + duration);
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiry format: ${expiry}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
    };

    return value * multipliers[unit as keyof typeof multipliers];
  }
}

export const jwtService = new JWTService();