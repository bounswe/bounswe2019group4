package com.example.arken.model;

public class SignupUser {


    private String name;
    private String surname;
    private String email;
    private String password;
    private String location;
    private boolean isTrader;
    private boolean isPublic;
    private String tckn;
    private String iban;

    public boolean isTrader() {
        return isTrader;
    }
    public boolean isPublic() {
        return isPublic;
    }

    public void setTrader(boolean trader) {
        isTrader = trader;
    }

    public void setIsPublic(boolean ispublic) {
        isPublic = ispublic;
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

    public SignupUser(String name, String surname, String email, String password, String location, boolean isPublic) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.location = location;
        this.isPublic = isPublic;
    }

    public SignupUser(String name, String surname, String email, String password, String location, boolean isTrader, boolean isPublic, String tckn, String iban) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.location = location;
        this.isTrader = isTrader;
        this.isPublic = isPublic;
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