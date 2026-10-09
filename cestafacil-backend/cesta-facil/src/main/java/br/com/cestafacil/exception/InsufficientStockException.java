package br.com.cestafacil.exception;
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String msg) { super(msg); }
}
