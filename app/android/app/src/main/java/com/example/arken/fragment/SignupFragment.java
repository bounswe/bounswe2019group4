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
import android.widget.Switch;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.model.SignupUser;
import com.example.arken.util.RetroClient;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignupFragment extends Fragment implements View.OnClickListener {
    EditText nameEditText;
    EditText surnameEditText;
    EditText emailEditText;
    EditText passwordEditText;
    Switch isTraderSwitch;
    Button signupButton;
    EditText ibanEditText;
    EditText tcknEditText;
    Button guestButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup, container, false);
        guestButton = view.findViewById(R.id.signup_guest_button);
        guestButton.setOnClickListener(this);
        ibanEditText = view.findViewById(R.id.signup_iban_editText);
        tcknEditText = view.findViewById(R.id.signup_tckn_editText);
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
                if (b) {
                    ibanEditText.setVisibility(View.VISIBLE);
                    tcknEditText.setVisibility(View.VISIBLE);
                } else {
                    ibanEditText.setVisibility(View.GONE);
                    tcknEditText.setVisibility(View.GONE);
                }
            }
        });
        return view;
    }

    @Override
    public void onClick(View view) {
        if (view.getId() != R.id.signup_email_editText && view.getId() != R.id.signup_iban_editText &&
                view.getId() != R.id.signup_name_editText && view.getId() != R.id.signup_password_editText &&
                view.getId() != R.id.signup_surname_editText && view.getId() != R.id.signup_tckn_editText) {
            InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if (view.getId() == R.id.signup_signup_button) {
            if (nameEditText.getText().toString().trim().equals("")) {
                Toast.makeText(getContext(), "Please enter your name", Toast.LENGTH_SHORT).show();
                return;
            }
            if (surnameEditText.getText().toString().trim().equals("")) {
                Toast.makeText(getContext(), "Please enter your surname", Toast.LENGTH_SHORT).show();
                return;
            }
            if (emailEditText.getText().toString().trim().equals("")) {
                Toast.makeText(getContext(), "Please enter your email", Toast.LENGTH_SHORT).show();
                return;
            }
            if (passwordEditText.getText().toString().trim().equals("")) {
                Toast.makeText(getContext(), "Please enter your password", Toast.LENGTH_SHORT).show();
                return;
            }
            String name = String.valueOf(nameEditText.getText());
            String surname = String.valueOf(surnameEditText.getText());
            String email = String.valueOf(emailEditText.getText());
            String password = String.valueOf(passwordEditText.getText());
            String location = "Turkey";
            Boolean isTrader = isTraderSwitch.isChecked();
            if (isTrader) {
                if (tcknEditText.getText().toString().trim().equals("")) {
                    Toast.makeText(getContext(), "Please enter your TC", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (ibanEditText.getText().toString().trim().equals("")) {
                    Toast.makeText(getContext(), "Please enter your iban", Toast.LENGTH_SHORT).show();
                    return;
                }
            }


            Call<ResponseBody> call;
            if (isTrader) {
                String tckn = String.valueOf(tcknEditText.getText());
                String iban = String.valueOf(ibanEditText.getText());
                call = RetroClient.getInstance().getAPIService().signup(new SignupUser(name,
                        surname, email, password, location, isTrader, tckn, iban));
            } else {
                call = RetroClient.getInstance().getAPIService().signup(new SignupUser(name,
                        surname, email, password, location));
            }


            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "You are registered!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(getContext(), response.raw().toString(), Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_signupFragment_to_listEventFragment);
        }
    }
}
