package com.example.arken.model;

public class SignupUser {


    private String name;
    private String surname;
    private String email;
    private String password;
    private String location;
    private boolean isTrader;
    private String tckn;
    private String iban;

    public boolean isTrader() {
        return isTrader;
    }

    public void setTrader(boolean trader) {
        isTrader = trader;
    }

    public String getTckn() {
        return tckn;
    }

    public void setTckn(String tckn) {
        this.tckn = tckn;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public SignupUser(String name, String surname, String email, String password, String location) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.location = location;
    }

    public SignupUser(String name, String surname, String email, String password, String location, boolean isTrader, String tckn, String iban) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.location = location;
        this.isTrader = isTrader;
        this.tckn = tckn;
        this.iban = iban;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}