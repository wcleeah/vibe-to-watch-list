import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly validTokens = new Set<string>();
  private readonly APP_PASSWORD = process.env.APP_PASSWORD;
  
  validatePassword(password: string): boolean {
    return password === this.APP_PASSWORD;
  }
  
  generateToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.validTokens.add(token);
    
    // Token expires after 24 hours
    setTimeout(() => {
      this.validTokens.delete(token);
    }, 24 * 60 * 60 * 1000);
    
    return token;
  }
  
  validateToken(token: string): boolean {
    return this.validTokens.has(token);
  }
  
  revokeToken(token: string): void {
    this.validTokens.delete(token);
  }
}
