export interface LocationProps {
  id?: number;
  cityName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Location {
  public readonly id?: number;
  public readonly cityName: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: LocationProps) {
    this.id = props.id;
    this.cityName = props.cityName;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
