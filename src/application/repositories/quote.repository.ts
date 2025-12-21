import { Quote } from "@domain/entities/quote.entity";

export interface IQuoteRepository {
  create(quote: Quote): Promise<Quote>;
}
