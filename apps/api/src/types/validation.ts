export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationService {
  static validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { field: 'email', message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Invalid email format' };
    }
    return null;
  }

  static validatePassword(password: string): ValidationError | null {
    if (!password) {
      return { field: 'password', message: 'Password is required' };
    }
    if (password.length < 8) {
      return { field: 'password', message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one number' };
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one special character (!@#$%^&*)' };
    }
    return null;
  }

  static validateName(name: string, field: string): ValidationError | null {
    if (!name || name.trim().length === 0) {
      return { field, message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` };
    }
    if (name.trim().length < 2) {
      return { field, message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 2 characters long` };
    }
    if (name.trim().length > 50) {
      return { field, message: `${field.charAt(0).toUpperCase() + field.slice(1)} must be less than 50 characters long` };
    }
    return null;
  }

  static validateRole(role: string): ValidationError | null {
    const validRoles = ['admin', 'product_manager', 'executive', 'team_lead', 'user'];
    if (role && !validRoles.includes(role)) {
      return { 
        field: 'role', 
        message: `Role must be one of: ${validRoles.join(', ')}` 
      };
    }
    return null;
  }

  static validateRegisterRequest(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push(emailError);

    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.push(passwordError);

    const firstNameError = this.validateName(data.firstName, 'firstName');
    if (firstNameError) errors.push(firstNameError);

    const lastNameError = this.validateName(data.lastName, 'lastName');
    if (lastNameError) errors.push(lastNameError);

    if (data.role) {
      const roleError = this.validateRole(data.role);
      if (roleError) errors.push(roleError);
    }

    return errors;
  }

  static validateLoginRequest(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push(emailError);

    if (!data.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    }

    return errors;
  }
}