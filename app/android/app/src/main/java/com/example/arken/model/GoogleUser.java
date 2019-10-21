package com.example.arken.model;

public class GoogleUser {


    private String name;
    private String surname;
    private String email;
    private String googleId;
    private String location;
    private boolean isTrader;
    private String tckn;
    private String iban;
    private boolean isPrivate;

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

    public GoogleUser(String name, String surname, String email, String googleId, String location, boolean isPrivate) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.googleId = googleId;
        this.location = location;
        this.isPrivate = isPrivate;
    }

    public GoogleUser(String name, String surname, String email, String googleId, String location, boolean isTrader, String tckn, String iban, boolean isPrivate) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.googleId = googleId;
        this.location = location;
        this.isTrader = isTrader;
        this.tckn = tckn;
        this.iban = iban;
        this.isPrivate = isPrivate;
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
        return googleId;
    }

    public void setPassword(String googleId) {
        this.googleId = googleId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}