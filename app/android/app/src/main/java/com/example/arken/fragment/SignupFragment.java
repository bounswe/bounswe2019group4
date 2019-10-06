package com.example.arken.fragment;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.example.arken.R;
import com.example.arken.util.RetroClient;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignupFragment extends Fragment implements View.OnClickListener {
    LinearLayout loginButton;
    EditText nameEditText;
    EditText surnameEditText;
    EditText emailEditText;
    EditText passwordEditText;
    Switch isTraderSwitch;
    Button signupButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup, container, false);

        final EditText ibanEditText = view.findViewById(R.id.signup_iban_editText);
        final EditText tcknEditText = view.findViewById(R.id.signup_tckn_editText);
        loginButton = view.findViewById(R.id.signup_loginButton_layout);
        loginButton.setOnClickListener(this);
        ConstraintLayout layout = view.findViewById(R.id.signup_background);
        layout.setOnClickListener(this);
        nameEditText = view.findViewById(R.id.signup_name_editText);
        surnameEditText = view.findViewById(R.id.signup_surname_editText);
        emailEditText = view.findViewById(R.id.signup_email_editText);
        passwordEditText = view.findViewById(R.id.signup_password_editText);
        signupButton = view.findViewById(R.id.signup_signup_button);
        signupButton.setOnClickListener(this);
        isTraderSwitch = view.findViewById(R.id.signup_isTrader_switch);
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
            if(nameEditText.getText().toString().trim().equals("")){
                Toast.makeText(getContext(),"Please enter your name", Toast.LENGTH_SHORT).show();
                return;
            }
            if(surnameEditText.getText().toString().trim().equals("")){
                Toast.makeText(getContext(),"Please enter your surname", Toast.LENGTH_SHORT).show();
                return;
            }
            if(emailEditText.getText().toString().trim().equals("")){
                Toast.makeText(getContext(),"Please enter your email", Toast.LENGTH_SHORT).show();
                return;
            }
            if(passwordEditText.getText().toString().trim().equals("")){
                Toast.makeText(getContext(),"Please enter your password", Toast.LENGTH_SHORT).show();
                return;
            }
            String name = String.valueOf(nameEditText.getText());
            String surname = String.valueOf(surnameEditText.getText());
            String email = String.valueOf(emailEditText.getText());
            String password = String.valueOf(passwordEditText.getText());
            String location = "Turkey";
            Boolean isTrader = isTraderSwitch.isChecked();

            Call<ResponseBody> call = RetroClient.getInstance().getAPIService().signup(name,
                    surname, email, password, location, isTrader);

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    try {
                        String r = response.body().string();
                        Toast.makeText(getContext(), r, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(getContext(),t.getMessage(), Toast.LENGTH_SHORT ).show();
                }
            });
        }
    }
}
