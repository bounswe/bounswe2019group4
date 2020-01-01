package com.example.arken.fragment.signup_login;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.example.arken.R;
import com.example.arken.model.Email;
import com.example.arken.util.RetroClient;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ForgotPasswordFragment extends Fragment implements View.OnClickListener {

    EditText emailEditText;
    Button sendEmailButton;

    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_forgot_password, container, false);

        sendEmailButton = view.findViewById(R.id.send_email_button);
        sendEmailButton.setOnClickListener(this);
        emailEditText = view.findViewById(R.id.forgot_password_email_editText);
        ConstraintLayout layout = view.findViewById(R.id.forgot_password_background);
        layout.setOnClickListener(this);
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.forgot_password_email_editText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }

        if(view.getId() == R.id.send_email_button){
            if(emailEditText.getText().toString().trim().equals("")){
                emailEditText.setError("Please enter your email");
                return;
            }


            String email = String.valueOf(emailEditText.getText());

            Call<ResponseBody> call = RetroClient.getInstance().getAPIService().forgetPassword(new Email(email));

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "Email sent!", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                }
            });
        }
    }
}
