package com.example.arken.fragment;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
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

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginFragment extends Fragment implements View.OnClickListener {
    LinearLayout signupButton;
    EditText emailEditText;
    EditText passwordEditText;
    Button loginButton;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        signupButton = view.findViewById(R.id.login_signupButton_layout);
        signupButton.setOnClickListener(this);
        loginButton = view.findViewById(R.id.login_login_button);
        loginButton.setOnClickListener(this);
        emailEditText = view.findViewById(R.id.login_email_editText);
        passwordEditText = view.findViewById(R.id.login_password_editText);
        ConstraintLayout layout = view.findViewById(R.id.login_background);
        layout.setOnClickListener(this);
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.login_email_editText && view.getId()!=R.id.login_password_editText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if(view.getId() == R.id.login_signupButton_layout){
            SignupFragment nextFrag= new SignupFragment();
            getActivity().getSupportFragmentManager().beginTransaction()
                    .add(R.id.root_layout, nextFrag, "findThisFragment")
                    .addToBackStack(null)
                    .commit();
        }
        else if(view.getId() == R.id.signup_signup_button){
            if(emailEditText.getText().toString().trim().equals("")){
                Toast.makeText(getContext(),"Please enter your email", Toast.LENGTH_SHORT).show();
                return;
            }
            if(passwordEditText.getText().toString().trim().equals("")){
                Toast.makeText(getContext(),"Please enter your password", Toast.LENGTH_SHORT).show();
                return;
            }

            String email = String.valueOf(emailEditText.getText());
            String password = String.valueOf(passwordEditText.getText());

            Call<ResponseBody> call = RetroClient.getInstance().getAPIService().login(email, password);

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if(response.isSuccessful()){
                        Toast.makeText(getContext(), "You are logged in!", Toast.LENGTH_SHORT).show();
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
