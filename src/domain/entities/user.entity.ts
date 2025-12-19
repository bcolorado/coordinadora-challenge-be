export interface UserProps {
  id?: number | undefined;
  document: string;
  documentType: string;
  email: string;
  hashedPassword: string;
  firstName: string;
  secondName?: string | null | undefined;
  firstSurname: string;
  secondSurname?: string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export class User {
  public readonly id: number | undefined;
  public readonly document: string;
  public readonly documentType: string;
  public readonly email: string;
  public readonly hashedPassword: string;
  public readonly firstName: string;
  public readonly secondName: string | null;
  public readonly firstSurname: string;
  public readonly secondSurname: string | null;
  public readonly createdAt: Date | undefined;
  public readonly updatedAt: Date | undefined;

  constructor(props: UserProps) {
    this.id = props.id;
    this.document = props.document;
    this.documentType = props.documentType;
    this.email = props.email.toLowerCase();
    this.hashedPassword = props.hashedPassword;
    this.firstName = props.firstName;
    this.secondName = props.secondName ?? null;
    this.firstSurname = props.firstSurname;
    this.secondSurname = props.secondSurname ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get fullName(): string {
    const parts = [
      this.firstName,
      this.secondName,
      this.firstSurname,
      this.secondSurname,
    ].filter(Boolean);
    return parts.join(" ");
  }

  /**
   * Create a new User instance with updated properties
   */
  //TODO remove if not needed
  with(props: Partial<UserProps>): User {
    return new User({
      id: props.id !== undefined ? props.id : this.id,
      document: props.document ?? this.document,
      documentType: props.documentType ?? this.documentType,
      email: props.email ?? this.email,
      hashedPassword: props.hashedPassword ?? this.hashedPassword,
      firstName: props.firstName ?? this.firstName,
      secondName:
        props.secondName !== undefined ? props.secondName : this.secondName,
      firstSurname: props.firstSurname ?? this.firstSurname,
      secondSurname:
        props.secondSurname !== undefined
          ? props.secondSurname
          : this.secondSurname,
      createdAt:
        props.createdAt !== undefined ? props.createdAt : this.createdAt,
      updatedAt:
        props.updatedAt !== undefined ? props.updatedAt : this.updatedAt,
    });
  }
}
