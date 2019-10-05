package com.example.arken.fragment;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Switch;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.example.arken.R;

import java.io.IOException;

public class SignupFragment extends Fragment implements View.OnClickListener {
    LinearLayout loginButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup, container, false);

        Switch isTraderSwitch = view.findViewById(R.id.signup_isTrader_switch);
        final EditText ibanEditText = view.findViewById(R.id.signup_iban_editText);
        final EditText tcknEditText = view.findViewById(R.id.signup_tckn_editText);
        loginButton = view.findViewById(R.id.signup_loginButton_layout);
        loginButton.setOnClickListener(this);
        ConstraintLayout layout = view.findViewById(R.id.signup_background);
        layout.setOnClickListener(this);
        isTraderSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if(b){
                    ibanEditText.setVisibility(View.VISIBLE);
                    tcknEditText.setVisibility(View.VISIBLE);
                }
                else{
                    ibanEditText.setVisibility(View.GONE);
                    tcknEditText.setVisibility(View.GONE);
                }
            }
        });
        return view;
    }
    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.signup_email_editText && view.getId()!=R.id.signup_iban_editText &&
                view.getId()!=R.id.signup_name_editText && view.getId()!=R.id.signup_password_editText &&
                view.getId()!=R.id.signup_surname_editText && view.getId()!=R.id.signup_tckn_editText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if(view.getId() == R.id.signup_loginButton_layout){
            LoginFragment nextFrag= new LoginFragment();
            getActivity().getSupportFragmentManager().beginTransaction()
                    .add(R.id.root_layout, nextFrag, "findThisFragment")
                    .addToBackStack(null)
                    .commit();
        }
        else if(view.getId() == R.id.signup_signup_button){
            //make post req
        }
    }
}
