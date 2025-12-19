/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         email:
 *           type: string
 *           example: test@example.com
 *         fullName:
 *           type: string
 *           example: John Doe
 */
export interface UserResponseDto {
  id: number;
  email: string;
  fullName: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - document
 *         - documentType
 *         - email
 *         - password
 *         - firstName
 *         - firstSurname
 *       properties:
 *         document:
 *           type: string
 *           example: "12345678"
 *         documentType:
 *           type: string
 *           example: "CC"
 *         email:
 *           type: string
 *           format: email
 *           example: "test@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "SecurePass123!"
 *         firstName:
 *           type: string
 *           example: "John"
 *         firstSurname:
 *           type: string
 *           example: "Doe"
 *         secondName:
 *           type: string
 *           example: "David"
 *         secondSurname:
 *           type: string
 *           example: "Smith"
 */
export interface RegisterRequestDto {
  document: string;
  documentType: string;
  email: string;
  password: string;
  firstName: string;
  secondName?: string | undefined;
  firstSurname: string;
  secondSurname?: string | undefined;
}

export interface RegisterResponseDto extends UserResponseDto {}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "test@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "SecurePass123!"
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 */
export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
}
